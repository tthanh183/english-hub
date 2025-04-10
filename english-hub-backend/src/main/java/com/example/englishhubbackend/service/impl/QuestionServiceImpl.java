package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
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
}
