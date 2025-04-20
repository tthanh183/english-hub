package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.ExamCreateRequest;
import com.example.englishhubbackend.dto.request.ExamUpdateRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.ExamResponse;
import com.example.englishhubbackend.service.ExamService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExamController {
     ExamService examService;

     @PostMapping("")
     public ApiResponse<ExamResponse> createExam(@RequestBody ExamCreateRequest request) {
         return ApiResponse.<ExamResponse>builder()
                 .result(examService.createExam(request))
                 .build();
     }

     @GetMapping("")
     public ApiResponse<List<ExamResponse>> getAllExams() {
         return ApiResponse.<List<ExamResponse>>builder()
                 .result(examService.getAllExams())
                 .build();
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
}
