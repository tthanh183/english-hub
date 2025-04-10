package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.ExerciseCreateRequest;
import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.response.ExerciseResponse;
import com.example.englishhubbackend.dto.response.QuestionResponse;

import java.util.List;
import java.util.UUID;

public interface ExerciseService {
    ExerciseResponse createExercise(UUID courseId, ExerciseCreateRequest exerciseCreateRequest);
    List<ExerciseResponse> getAllExerciseFromCourse(UUID courseID);
    void deleteExercise(UUID exerciseId);
    QuestionResponse addQuestionsToExercise(UUID exerciseId, QuestionCreateRequest questionCreateRequest);
    List<QuestionResponse> getAllQuestionsFromExercise(UUID exerciseId);
}
