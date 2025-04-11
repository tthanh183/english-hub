package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.ExerciseCreateRequest;
import com.example.englishhubbackend.dto.request.ExerciseUpdateRequest;
import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.response.ExerciseResponse;
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
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

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
    exercise.setCreatedAt(LocalDate.now());
    exercise.setCourse(course);
    return exerciseMapper.toExerciseResponse(exerciseRepository.save(exercise));
  }

  @Override
  public List<ExerciseResponse> getAllExerciseFromCourse(UUID courseID) {
    return exerciseRepository.findAllByCourseIdOrderByCreatedAt(courseID).stream()
        .map(exerciseMapper::toExerciseResponse)
        .toList();
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
  public QuestionResponse addQuestionsToExercise(
      UUID exerciseId, QuestionCreateRequest questionCreateRequest) {
    Exercise exercise =
        exerciseRepository
            .findById(exerciseId)
            .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));
    Question question = questionService.createQuestionEntity(questionCreateRequest);
    question.setCreatedAt(LocalDate.now());
    question.setExercise(exercise);
    return mapQuestionToResponse(questionService.saveQuestion(question));
  }

  @Override
  public List<QuestionResponse> getAllQuestionsFromExercise(UUID exerciseId) {
    Exercise exercise =
        exerciseRepository
            .findById(exerciseId)
            .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));
    return exercise.getQuestions().stream()
        .map(this::mapQuestionToResponse)
        .collect(Collectors.toList());
  }

  private QuestionResponse mapQuestionToResponse(Question question) {
    if (question instanceof ListeningQuestion) {
      return questionMapper.toQuestionResponse((ListeningQuestion) question);
    } else if (question instanceof ReadingQuestion) {
      return questionMapper.toQuestionResponse((ReadingQuestion) question);
    } else {
      throw new AppException(ErrorCode.QUESTION_TYPE_NOT_SUPPORTED);
    }
  }
}
