package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.ExerciseCreateRequest;
import com.example.englishhubbackend.dto.request.ExerciseUpdateRequest;
import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.request.QuestionUpdateRequest;
import com.example.englishhubbackend.dto.response.ExerciseResponse;
import com.example.englishhubbackend.dto.response.QuestionGroupResponse;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.ExerciseMapper;
import com.example.englishhubbackend.mapper.QuestionMapper;
import com.example.englishhubbackend.models.*;
import com.example.englishhubbackend.repository.ExerciseRepository;
import com.example.englishhubbackend.service.CourseService;
import com.example.englishhubbackend.service.ExerciseService;
import com.example.englishhubbackend.service.QuestionService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExerciseServiceImpl implements ExerciseService {
  ExerciseRepository exerciseRepository;
  ExerciseMapper exerciseMapper;
  CourseService courseService;
  QuestionService questionService;
  QuestionMapper questionMapper;

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public ExerciseResponse createExercise(
      UUID courseId, ExerciseCreateRequest exerciseCreateRequest) {
    Course course = courseService.getCourseEntityById(courseId);
    if (course == null) {
      throw new AppException(ErrorCode.COURSE_NOT_FOUND);
    }
    Exercise exercise = exerciseMapper.toExercise(exerciseCreateRequest);
    exercise.setCreatedDate(LocalDateTime.now());
    exercise.setCourse(course);
    return exerciseMapper.toExerciseResponse(exerciseRepository.save(exercise));
  }

  @Override
  public List<ExerciseResponse> getAllExerciseFromCourse(UUID courseID) {
    return exerciseRepository.findAllByCourseIdOrderByCreatedDate(courseID).stream()
        .map(exerciseMapper::toExerciseResponse)
        .toList();
  }

  @Override
  public ExerciseResponse getExerciseById(UUID courseId, UUID exerciseId) {
    Course course = courseService.getCourseEntityById(courseId);
    if (course == null) {
      throw new AppException(ErrorCode.COURSE_NOT_FOUND);
    }
    Exercise exercise = exerciseRepository
            .findById(exerciseId)
            .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));
    return exerciseMapper.toExerciseResponse(exercise);
  }

  @Override
  public ExerciseResponse updateExercise(UUID exerciseId, ExerciseUpdateRequest exerciseUpdateRequest) {
    Exercise exercise = exerciseRepository
            .findById(exerciseId)
            .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));
    exercise.setTitle(exerciseUpdateRequest.getTitle());
    return exerciseMapper.toExerciseResponse(exerciseRepository.save(exercise));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public void deleteExercise(UUID exerciseId) {
    Exercise exercise =
        exerciseRepository
            .findById(exerciseId)
            .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));
    exerciseRepository.delete(exercise);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public List<QuestionResponse> addQuestionsToExercise(
          UUID exerciseId, List<QuestionCreateRequest> questionCreateRequests) {

    Exercise exercise = exerciseRepository
            .findById(exerciseId)
            .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));

    UUID groupId = UUID.randomUUID();

    List<QuestionResponse> questionResponses = new ArrayList<>();

    for (QuestionCreateRequest questionCreateRequest : questionCreateRequests) {
      Question question = questionService.createQuestionEntity(questionCreateRequest);

      question.setGroupId(groupId);

      question.setExercise(exercise);

      Question savedQuestion = questionService.saveQuestion(question);
      questionResponses.add(questionService.mapQuestionToResponse(savedQuestion));
    }

    return questionResponses;
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public QuestionResponse addQuestionToExercise(
          UUID exerciseId, QuestionCreateRequest questionCreateRequest) {
    Exercise exercise =
            exerciseRepository
                    .findById(exerciseId)
                    .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));
    Question question = questionService.createQuestionEntity(questionCreateRequest);
    UUID groupId = UUID.randomUUID();
    question.setGroupId(groupId);
    question.setCreatedAt(LocalDateTime.now());
    question.setExercise(exercise);
    return questionService.mapQuestionToResponse(questionService.saveQuestion(question));
  }


  @Override
  public List<QuestionResponse> getAllQuestionsFromExercise(UUID exerciseId) {
    Exercise exercise =
        exerciseRepository
            .findById(exerciseId)
            .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));
    return exercise.getQuestions().stream()
        .map(questionService::mapQuestionToResponse)
        .collect(Collectors.toList());
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public QuestionResponse updateQuestionInExercise(UUID exerciseId, UUID questionId, QuestionUpdateRequest questionUpdateRequest) {
    Exercise exercise =
        exerciseRepository
            .findById(exerciseId)
            .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));

    Question question = questionService.updateQuestionEntity(questionId, questionUpdateRequest);
    question.setExercise(exercise);
    return questionService.mapQuestionToResponse(questionService.saveQuestion(question));
  }

  @Override
  public List<QuestionGroupResponse> getQuestionGroupsFromExercise(UUID exerciseId) {
    Exercise exercise = exerciseRepository
            .findById(exerciseId)
            .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));

    List<Question> questions = exercise.getQuestions().stream()
            .sorted(Comparator.comparing(Question::getCreatedAt))
            .toList();

    Map<UUID, List<Question>> grouped = questions.stream()
            .collect(Collectors.groupingBy(
                    Question::getGroupId,
                    LinkedHashMap::new,
                    Collectors.toList()
            ));
    List<QuestionGroupResponse> response = new ArrayList<>();

    for (Map.Entry<UUID, List<Question>> entry : grouped.entrySet()) {
      UUID groupId = entry.getKey();
      List<Question> groupQuestions = entry.getValue();

      QuestionGroupResponse groupResponse = new QuestionGroupResponse();
      groupResponse.setGroupId(groupId);
      groupResponse.setQuestions(groupQuestions.stream()
              .map(questionService::mapQuestionToResponse)
              .toList());

      Question first = groupQuestions.getFirst();
      if (first instanceof ListeningQuestion listening) {
        groupResponse.setAudioUrl(listening.getAudio().getUrl());
        groupResponse.setImageUrl(listening.getImageUrl());
      } else if (first instanceof ReadingQuestion reading) {
        groupResponse.setPassage(reading.getPassage().getContent());
      }

      response.add(groupResponse);
    }
    return response;
  }

}
