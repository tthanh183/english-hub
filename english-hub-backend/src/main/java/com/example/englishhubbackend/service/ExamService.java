package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.*;
import com.example.englishhubbackend.dto.response.ExamResponse;
import com.example.englishhubbackend.dto.response.ExamSubmissionResponse;
import com.example.englishhubbackend.dto.response.QuestionGroupResponse;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import java.util.List;
import java.util.UUID;

public interface ExamService {
  ExamResponse createExam(ExamCreateRequest examCreateRequest);

  List<ExamResponse> getAllExams();

  ExamResponse getExamById(UUID examId);

  ExamResponse updateExam(UUID examId, ExamUpdateRequest examUpdateRequest);

  void deleteExam(UUID examId);

  List<QuestionResponse> addQuestionsToExam(
      UUID examId, List<QuestionCreateRequest> questionCreateRequest);

  QuestionResponse addQuestionToExam(UUID examId, QuestionCreateRequest questionCreateRequest);

  List<QuestionResponse> getAllQuestionsFromExam(UUID examId);

  QuestionResponse updateQuestionInExam(
      UUID examId, UUID questionId, QuestionUpdateRequest questionUpdateRequest);

  List<QuestionGroupResponse> getQuestionGroupsFromExam(UUID examId);

  ExamSubmissionResponse submitExam(UUID examId, ExamSubmissionRequest examSubmissionRequest);

    void deleteQuestionFromExam(UUID examId, UUID questionId);
}
