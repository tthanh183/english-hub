package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.request.QuestionUpdateRequest;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.enums.QuestionTypeEnum;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.QuestionMapper;
import com.example.englishhubbackend.models.*;
import com.example.englishhubbackend.repository.QuestionRepository;
import com.example.englishhubbackend.service.AudioService;
import com.example.englishhubbackend.service.QuestionService;
import com.example.englishhubbackend.service.QuestionTypeService;
import com.example.englishhubbackend.service.S3Service;
import java.time.LocalDate;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QuestionServiceImpl implements QuestionService {
  QuestionRepository questionRepository;
  QuestionMapper questionMapper;
  S3Service s3Service;
  AudioService audioService;
  QuestionTypeService questionTypeService;

  @Override
  public Question createQuestionEntity(QuestionCreateRequest questionCreateRequest) {
    QuestionType questionType =
        questionTypeService.getQuestionTypeEntityByDescription(
            questionCreateRequest.getQuestionType());

    Question question;
    if (questionType.getName().equals(QuestionTypeEnum.PART_1_PHOTOGRAPHS.name())
        || questionType.getName().equals(QuestionTypeEnum.PART_2_QUESTION_RESPONSES.name())
        || questionType.getName().equals(QuestionTypeEnum.PART_3_CONVERSATIONS.name())
        || questionType.getName().equals(QuestionTypeEnum.PART_4_TALKS.name())) {

      ListeningQuestion listeningQuestion =
          questionMapper.toListeningQuestion(questionCreateRequest);
      listeningQuestion.setQuestionType(questionType);

      String audioUrl = s3Service.uploadFileToS3(questionCreateRequest.getAudio());
      Audio audio = new Audio();
      audio.setUrl(audioUrl);
      audioService.saveAudio(audio);

      listeningQuestion.setAudio(audio);
      listeningQuestion.setImageUrl(s3Service.uploadFileToS3(questionCreateRequest.getImage()));

      question = listeningQuestion;

    } else if (questionType.getName().equals(QuestionTypeEnum.PART_5_INCOMPLETE_SENTENCES.name())
        || questionType.getName().equals(QuestionTypeEnum.PART_6_TEXT_COMPLETION.name())
        || questionType.getName().equals(QuestionTypeEnum.PART_7_READING_COMPREHENSION.name())) {

      ReadingQuestion readingQuestion = questionMapper.toReadingQuestion(questionCreateRequest);
      readingQuestion.setQuestionType(questionType);

      Passage passage = new Passage();
      passage.setContent(questionCreateRequest.getPassage());
      readingQuestion.setPassage(passage);

      question = readingQuestion;
    } else {
      throw new AppException(ErrorCode.QUESTION_TYPE_NOT_SUPPORTED);
    }

    question.setCreatedAt(LocalDate.now());
    return question;
  }

  @Override
  public Question saveQuestion(Question question) {
    return questionRepository.save(question);
  }

  @Override
  public Question updateQuestionEntity(UUID questionId, QuestionUpdateRequest request) {
    Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));

    if (question instanceof ListeningQuestion listeningQuestion) {
      return updateListeningQuestion(listeningQuestion, request);
    } else if (question instanceof ReadingQuestion readingQuestion) {
      return updateReadingQuestion(readingQuestion, request);
    }

    throw new AppException(ErrorCode.QUESTION_TYPE_NOT_SUPPORTED);
  }

  private ListeningQuestion updateListeningQuestion(ListeningQuestion question, QuestionUpdateRequest request) {
    questionMapper.toListeningQuestion(request, question);

    if (request.getAudio() != null && !request.getAudio().isEmpty()) {
      Audio audio = question.getAudio();
      if (audio != null) {
        s3Service.deleteFileFromS3(audio.getUrl());
        String newAudioUrl = s3Service.uploadFileToS3(request.getAudio());
        audio.setUrl(newAudioUrl);
        audioService.saveAudio(audio);
      } else {
        Audio newAudio = new Audio();
        newAudio.setUrl(s3Service.uploadFileToS3(request.getAudio()));
        audioService.saveAudio(newAudio);
        question.setAudio(newAudio);
      }
    }

    if (request.getImage() != null && !request.getImage().isEmpty()) {
      if (question.getImageUrl() != null) {
        s3Service.deleteFileFromS3(question.getImageUrl());
      }
      question.setImageUrl(s3Service.uploadFileToS3(request.getImage()));
    }

    return questionRepository.save(question);
  }

  private ReadingQuestion updateReadingQuestion(ReadingQuestion question, QuestionUpdateRequest request) {
    questionMapper.toReadingQuestion(request, question);

    if (question.getPassage() != null) {
      question.getPassage().setContent(request.getPassage());
    }

    return questionRepository.save(question);
  }


  public QuestionResponse mapQuestionToResponse(Question question) {
    if (question instanceof ListeningQuestion) {
      return questionMapper.toQuestionResponse((ListeningQuestion) question);
    } else if (question instanceof ReadingQuestion) {
      return questionMapper.toQuestionResponse((ReadingQuestion) question);
    } else {
      throw new AppException(ErrorCode.QUESTION_TYPE_NOT_SUPPORTED);
    }
  }
}
