package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.request.QuestionUpdateRequest;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.enums.QuestionTypeEnum;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.QuestionMapper;
import com.example.englishhubbackend.models.*;
import com.example.englishhubbackend.repository.AudioRepository;
import com.example.englishhubbackend.repository.PassageRepository;
import com.example.englishhubbackend.repository.QuestionRepository;
import com.example.englishhubbackend.service.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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
  AudioService audioService;
  PassageService passageService;
  QuestionTypeService questionTypeService;
  AudioRepository audioRepository;
  PassageRepository passageRepository;

  @Override
  public Question createQuestionEntity(QuestionCreateRequest request) {
    QuestionType questionType = questionTypeService.getQuestionTypeEntityById(request.getQuestionType());
    String questionTypeName = questionType.getName();
    Question question;

    if (questionTypeName.equals(QuestionTypeEnum.PART_1_PHOTOGRAPHS.name()) ||
            questionTypeName.equals(QuestionTypeEnum.PART_2_QUESTION_RESPONSES.name()) ||
            questionTypeName.equals(QuestionTypeEnum.PART_3_CONVERSATIONS.name()) ||
            questionTypeName.equals(QuestionTypeEnum.PART_4_TALKS.name() )) {
      ListeningQuestion listeningQuestion = questionMapper.toListeningQuestion(request);
      listeningQuestion.setQuestionType(questionType);

      Audio audio = audioRepository.findByUrl(request.getAudioUrl());
      if (audio == null) {
        audio = new Audio();
        audio.setUrl(request.getAudioUrl());
        audioRepository.save(audio);
      }
      listeningQuestion.setAudio(audio);

      if (request.getImageUrl() != null) {
        listeningQuestion.setImageUrl(request.getImageUrl());
      }

      question = listeningQuestion;

    } else if (questionTypeName.equals(QuestionTypeEnum.PART_5_INCOMPLETE_SENTENCES.name()) ||
            questionTypeName.equals(QuestionTypeEnum.PART_6_TEXT_COMPLETION.name()) ||
            questionTypeName.equals(QuestionTypeEnum.PART_7_READING_COMPREHENSION.name())) {
      ReadingQuestion readingQuestion = questionMapper.toReadingQuestion(request);
      readingQuestion.setQuestionType(questionType);

      if (request.getPassage() != null && !request.getPassage().isEmpty()) {
        Passage passage = passageRepository.findByContent(request.getPassage());
        if(passage == null) {
          passage = new Passage();
          passage.setContent(request.getPassage());
          passageRepository.save(passage);
        }
        readingQuestion.setPassage(passage);
      }

      question = readingQuestion;
    } else {
      throw new AppException(ErrorCode.QUESTION_TYPE_NOT_SUPPORTED);
    }

    question.setCreatedAt(LocalDateTime.now());
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

    if (request.getAudioUrl() != null) {
      Audio audio = question.getAudio();
      if (audio != null) {
        audio.setUrl(request.getAudioUrl());
        audioService.saveAudio(audio);
      } else {
        Audio existingAudio = audioRepository.findByUrl(request.getAudioUrl());
        if(existingAudio != null) {
          audio = existingAudio;
        } else {
          audio = new Audio();
          audio.setUrl(request.getAudioUrl());
        }
        audioService.saveAudio(audio);
      }
      question.setAudio(audio);
    }

    if (request.getImageUrl() != null) {
      question.setImageUrl(request.getImageUrl());
    } else {
      question.setImageUrl(null);
    }

    return questionRepository.save(question);
  }


  private ReadingQuestion updateReadingQuestion(ReadingQuestion question, QuestionUpdateRequest request) {
    questionMapper.toReadingQuestion(request, question);

    if(request.getPassage() != null) {
      Passage passage = question.getPassage();
      if(passage != null) {
        passage.setContent(request.getPassage());
        passageService.savePassage(passage);
      } else {
        Passage existingPassage = passageRepository.findByContent(request.getPassage());
        if(existingPassage != null) {
          passage = existingPassage;
        } else {
          passage = new Passage();
          passage.setContent(request.getPassage());
        }
        passageService.savePassage(passage);
      }
      question.setPassage(passage);
    }

    return questionRepository.save(question);
  }

  @Override
  public List<QuestionResponse> getQuestionsByGroupId(UUID groupId) {
    return questionRepository.findAllByGroupId(groupId)
            .stream()
            .map(this::mapQuestionToResponse)
            .toList();
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
