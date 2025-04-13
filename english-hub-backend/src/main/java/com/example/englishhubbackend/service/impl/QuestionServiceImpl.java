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

import com.example.englishhubbackend.util.S3Util;
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
  public Question createQuestionEntity(QuestionCreateRequest request) {
    QuestionType questionType = questionTypeService.getQuestionTypeEntityById(request.getQuestionType());
    String questionTypeName = questionType.getName();
    Question question;

    if (questionTypeName.equals(QuestionTypeEnum.PART_1_PHOTOGRAPHS.name())) {
      ListeningQuestion listeningQuestion = questionMapper.toListeningQuestion(request);
      listeningQuestion.setQuestionType(questionType);

      String audioUrl = s3Service.uploadFileToS3(request.getAudio());
      Audio audio = new Audio();
      audio.setUrl(audioUrl);
      audioService.saveAudio(audio);
      listeningQuestion.setAudio(audio);

      if (request.getImage() != null && !request.getImage().isEmpty()) {
        listeningQuestion.setImageUrl(s3Service.uploadFileToS3(request.getImage()));
      }

      question = listeningQuestion;

    } else if (questionTypeName.equals(QuestionTypeEnum.PART_2_QUESTION_RESPONSES.name()) ||
            questionTypeName.equals(QuestionTypeEnum.PART_3_CONVERSATIONS.name()) ||
            questionTypeName.equals(QuestionTypeEnum.PART_4_TALKS.name())) {
      ListeningQuestion listeningQuestion = questionMapper.toListeningQuestion(request);
      listeningQuestion.setQuestionType(questionType);

      String audioUrl = s3Service.uploadFileToS3(request.getAudio());
      Audio audio = new Audio();
      audio.setUrl(audioUrl);
      audioService.saveAudio(audio);
      listeningQuestion.setAudio(audio);

      listeningQuestion.setImageUrl(null);

      question = listeningQuestion;

    } else if (questionTypeName.equals(QuestionTypeEnum.PART_5_INCOMPLETE_SENTENCES.name()) ||
            questionTypeName.equals(QuestionTypeEnum.PART_6_TEXT_COMPLETION.name()) ||
            questionTypeName.equals(QuestionTypeEnum.PART_7_READING_COMPREHENSION.name())) {
      ReadingQuestion readingQuestion = questionMapper.toReadingQuestion(request);
      readingQuestion.setQuestionType(questionType);

      if (request.getPassage() != null && !request.getPassage().isEmpty()) {
        Passage passage = new Passage();
        passage.setContent(request.getPassage());
        readingQuestion.setPassage(passage);
      }

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
        s3Service.deleteFileFromS3(S3Util.getFileName(audio.getUrl()));
        String newAudioUrl = s3Service.uploadFileToS3(request.getAudio());
        audio.setUrl(newAudioUrl);
        audioService.saveAudio(audio);
      } else {
        audio = new Audio();
        audio.setUrl(s3Service.uploadFileToS3(request.getAudio()));
        audioService.saveAudio(audio);
      }
      question.setAudio(audio);
    }

    String questionTypeName = question.getQuestionType().getName();

    if (questionTypeName.equals(QuestionTypeEnum.PART_1_PHOTOGRAPHS.name())) {
      if (request.getImage() != null && !request.getImage().isEmpty()) {
        if (question.getImageUrl() != null) {
          s3Service.deleteFileFromS3(S3Util.getFileName(question.getImageUrl()));
        }
        question.setImageUrl(s3Service.uploadFileToS3(request.getImage()));
      }
    } else {
      question.setImageUrl(null);
    }

    return questionRepository.save(question);
  }


  private ReadingQuestion updateReadingQuestion(ReadingQuestion question, QuestionUpdateRequest request) {
    questionMapper.toReadingQuestion(request, question);

    if (request.getPassage() != null && question.getPassage() != null) {
      question.getPassage().setContent(request.getPassage());
    } else if (request.getPassage() != null) {
      Passage passage = new Passage();
      passage.setContent(request.getPassage());
      question.setPassage(passage);
    }

    return questionRepository.save(question);
  }


  public QuestionResponse mapQuestionToResponse(Question question) {
    if (question instanceof ListeningQuestion listeningQuestion) {
        return questionMapper.toQuestionResponse(listeningQuestion);
    } else if (question instanceof ReadingQuestion readingQuestion) {
      return questionMapper.toQuestionResponse(readingQuestion);
    } else {
      throw new AppException(ErrorCode.QUESTION_TYPE_NOT_SUPPORTED);
    }
  }
}
