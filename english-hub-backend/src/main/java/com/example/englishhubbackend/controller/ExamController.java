package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.*;
import com.example.englishhubbackend.dto.response.*;
import com.example.englishhubbackend.service.ExamService;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExamController {
  ExamService examService;

  @PostMapping("")
  public ApiResponse<ExamResponse> createExam(@RequestBody ExamCreateRequest request) {
    return ApiResponse.<ExamResponse>builder().result(examService.createExam(request)).build();
  }

  @GetMapping("")
  public ApiResponse<List<ExamResponse>> getAllExams() {
    return ApiResponse.<List<ExamResponse>>builder().result(examService.getAllExams()).build();
  }

  @GetMapping("/{examId}")
  public ApiResponse<ExamResponse> getExamById(@PathVariable String examId) {
    return ApiResponse.<ExamResponse>builder()
        .result(examService.getExamById(UUID.fromString(examId)))
        .build();
  }

  @PutMapping("/{examId}")
  public ApiResponse<ExamResponse> updateExam(
      @PathVariable String examId, @RequestBody ExamUpdateRequest examUpdateRequest) {
    return ApiResponse.<ExamResponse>builder()
        .result(examService.updateExam(UUID.fromString(examId), examUpdateRequest))
        .build();
  }

  @DeleteMapping("/{examId}")
  public ApiResponse<Void> deleteExam(@PathVariable String examId) {
    examService.deleteExam(UUID.fromString(examId));
    return ApiResponse.<Void>builder().message("Exam deleted successfully").build();
  }

  @PostMapping("/{examId}/question")
  public ApiResponse<QuestionResponse> addQuestionToExam(
      @PathVariable String examId, @RequestBody QuestionCreateRequest questionCreateRequest) {
    return ApiResponse.<QuestionResponse>builder()
        .result(examService.addQuestionToExam(UUID.fromString(examId), questionCreateRequest))
        .build();
  }

  @PostMapping("/{examId}/questions")
  public ApiResponse<List<QuestionResponse>> addQuestionsToExam(
      @PathVariable String examId,
      @RequestBody List<QuestionCreateRequest> questionCreateRequests) {
    return ApiResponse.<List<QuestionResponse>>builder()
        .result(examService.addQuestionsToExam(UUID.fromString(examId), questionCreateRequests))
        .build();
  }

  @GetMapping("/{examId}/questions")
  public ApiResponse<List<QuestionResponse>> getQuestionsFromExam(@PathVariable String examId) {
    return ApiResponse.<List<QuestionResponse>>builder()
        .result(examService.getAllQuestionsFromExam(UUID.fromString(examId)))
        .build();
  }

  @PutMapping("/{examId}/questions/{questionId}")
  public ApiResponse<QuestionResponse> updateQuestionInExam(
      @PathVariable String examId,
      @PathVariable String questionId,
      @RequestBody QuestionUpdateRequest questionUpdateRequest) {
    return ApiResponse.<QuestionResponse>builder()
        .result(
            examService.updateQuestionInExam(
                UUID.fromString(examId), UUID.fromString(questionId), questionUpdateRequest))
        .build();
  }

  @GetMapping("/{examId}/questions/groups")
  public ApiResponse<List<QuestionGroupResponse>> getQuestionGroupsFromExam(
      @PathVariable String examId) {
    return ApiResponse.<List<QuestionGroupResponse>>builder()
        .result(examService.getQuestionGroupsFromExam(UUID.fromString(examId)))
        .build();
  }

  @PostMapping("/{examId}/submit")
  public ApiResponse<ExamSubmissionResponse> submitExam(
      @PathVariable String examId, @RequestBody ExamSubmissionRequest examSubmissionRequest) {
    return ApiResponse.<ExamSubmissionResponse>builder()
        .result(examService.submitExam(UUID.fromString(examId), examSubmissionRequest))
        .build();
  }

  @DeleteMapping("/{examId}/questions/{questionId}")
  public ApiResponse<Void> deleteQuestionFromExam(
      @PathVariable String examId, @PathVariable String questionId) {
    examService.deleteQuestionFromExam(UUID.fromString(examId), UUID.fromString(questionId));
    return ApiResponse.<Void>builder().message("Question deleted successfully").build();
  }
}
