package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.request.QuestionUpdateRequest;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.models.Question;
import java.util.List;
import java.util.UUID;

public interface QuestionService {
  Question createQuestionEntity(QuestionCreateRequest questionCreateRequest);

  Question saveQuestion(Question question);

  Question updateQuestionEntity(UUID questionId, QuestionUpdateRequest questionUpdateRequest);

  QuestionResponse mapQuestionToResponse(Question question);

  List<QuestionResponse> getQuestionsByGroupId(UUID groupId);
}
