package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.ExerciseCreateRequest;
import com.example.englishhubbackend.dto.request.ExerciseUpdateRequest;
import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.request.QuestionUpdateRequest;
import com.example.englishhubbackend.dto.response.ExerciseResponse;
import com.example.englishhubbackend.dto.response.QuestionGroupResponse;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import java.util.List;
import java.util.UUID;

public interface ExerciseService {
  ExerciseResponse createExercise(UUID courseId, ExerciseCreateRequest exerciseCreateRequest);

  List<ExerciseResponse> getAllExerciseFromCourse(UUID courseID);

  ExerciseResponse updateExercise(UUID exerciseId, ExerciseUpdateRequest exerciseUpdateRequest);

  void deleteExercise(UUID exerciseId);

  List<QuestionResponse> addQuestionsToExercise(
      UUID exerciseId, List<QuestionCreateRequest> questionCreateRequest);

  QuestionResponse addQuestionToExercise(
      UUID exerciseId, QuestionCreateRequest questionCreateRequest);

  List<QuestionResponse> getAllQuestionsFromExercise(UUID exerciseId);

  QuestionResponse updateQuestionInExercise(
      UUID exerciseId, UUID questionId, QuestionUpdateRequest questionUpdateRequest);

  ExerciseResponse getExerciseById(UUID courseId, UUID exerciseId);

  List<QuestionGroupResponse> getQuestionGroupsFromExercise(UUID exerciseId);

  void deleteQuestionFromExercise(UUID exerciseId, UUID questionId);
}
