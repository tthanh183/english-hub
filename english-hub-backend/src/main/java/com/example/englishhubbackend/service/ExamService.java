package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.ExamCreateRequest;
import com.example.englishhubbackend.dto.request.ExamUpdateRequest;
import com.example.englishhubbackend.dto.response.ExamResponse;

import java.util.List;
import java.util.UUID;

public interface ExamService {
    ExamResponse createExam(ExamCreateRequest examCreateRequest);

    List<ExamResponse> getAllExams();

    ExamResponse getExamById(UUID examId);

    ExamResponse updateExam(UUID examId, ExamUpdateRequest examUpdateRequest);

    void deleteExam(UUID examId);

}
