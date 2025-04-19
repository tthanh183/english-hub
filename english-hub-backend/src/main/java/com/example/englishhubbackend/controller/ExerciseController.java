package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.ExerciseCreateRequest;
import com.example.englishhubbackend.dto.request.ExerciseUpdateRequest;
import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.request.QuestionUpdateRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.ExerciseResponse;
import com.example.englishhubbackend.dto.response.QuestionGroupResponse;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.service.ExerciseService;

import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses/{courseId}/exercises")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExerciseController {
  ExerciseService exerciseService;

  @PostMapping("")
  public ApiResponse<ExerciseResponse> createExercise(
      @PathVariable String courseId, @RequestBody ExerciseCreateRequest exerciseCreateRequest) {
    return ApiResponse.<ExerciseResponse>builder()
        .result(exerciseService.createExercise(UUID.fromString(courseId), exerciseCreateRequest))
        .build();
  }

  @GetMapping("")
  public ApiResponse<List<ExerciseResponse>> getAllExercises(@PathVariable String courseId) {
    return ApiResponse.<List<ExerciseResponse>>builder()
        .result(exerciseService.getAllExerciseFromCourse(UUID.fromString(courseId)))
        .build();
  }

  @GetMapping("/{exerciseId}")
    public ApiResponse<ExerciseResponse> getExercise(
        @PathVariable String courseId, @PathVariable String exerciseId) {
        return ApiResponse.<ExerciseResponse>builder()
            .result(exerciseService.getExerciseById(UUID.fromString(courseId), UUID.fromString(exerciseId)))
            .build();
    }

  @PutMapping("{exerciseId}")
    public ApiResponse<ExerciseResponse> updateExercise(
        @PathVariable String exerciseId,
        @RequestBody ExerciseUpdateRequest exerciseUpdateRequest) {
        return ApiResponse.<ExerciseResponse>builder()
            .result(
                exerciseService.updateExercise(
                    UUID.fromString(exerciseId), exerciseUpdateRequest))
            .build();
    }

  @DeleteMapping("/{exerciseId}")
  public ApiResponse<Void> deleteExercise(@PathVariable String exerciseId) {
    exerciseService.deleteExercise(UUID.fromString(exerciseId));
    return ApiResponse.<Void>builder().message("Exercise deleted successfully").build();
  }

  @PostMapping("/{exerciseId}/question")
  public ApiResponse<QuestionResponse> addQuestionToExercise(
      @PathVariable String exerciseId,
      @RequestBody QuestionCreateRequest questionCreateRequest) {
    return ApiResponse.<QuestionResponse>builder()
        .result(
            exerciseService.addQuestionToExercise(
                UUID.fromString(exerciseId), questionCreateRequest))
        .build();
  }

  @PostMapping("/{exerciseId}/questions")
  public ApiResponse<List<QuestionResponse>> addQuestionsToExercise(
      @PathVariable String exerciseId,
      @RequestBody List<QuestionCreateRequest> questionCreateRequest) {
      return ApiResponse.<List<QuestionResponse>>builder()
          .result(
              exerciseService.addQuestionsToExercise(
                  UUID.fromString(exerciseId), questionCreateRequest))
          .build();
  }

  @GetMapping("/{exerciseId}/questions")
  public ApiResponse<List<QuestionResponse>> getAllQuestionsFromExercise(
      @PathVariable String exerciseId) {
    return ApiResponse.<List<QuestionResponse>>builder()
        .result(exerciseService.getAllQuestionsFromExercise(UUID.fromString(exerciseId)))
        .build();
  }

  @PutMapping("/{exerciseId}/questions/{questionId}")
  public ApiResponse<QuestionResponse> updateQuestionInExercise(
      @PathVariable String exerciseId,
      @PathVariable String questionId,
      @RequestBody QuestionUpdateRequest questionUpdateRequest) {
      return ApiResponse.<QuestionResponse>builder()
          .result(
              exerciseService.updateQuestionInExercise(
                  UUID.fromString(exerciseId),
                  UUID.fromString(questionId),
                  questionUpdateRequest))
          .build();
  }

  @GetMapping("/{exerciseId}/questions/groups")
    public ApiResponse<List<QuestionGroupResponse>> getQuestionGroupsFromExercise(
        @PathVariable String exerciseId) {
        return ApiResponse.<List<QuestionGroupResponse>>builder()
            .result(exerciseService.getQuestionGroupsFromExercise(UUID.fromString(exerciseId)))
            .build();
    }

}
