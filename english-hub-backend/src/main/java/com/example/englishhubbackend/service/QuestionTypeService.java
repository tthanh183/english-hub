package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.response.QuestionTypeResponse;
import com.example.englishhubbackend.models.QuestionType;

import java.util.List;

public interface QuestionTypeService {
    List<QuestionTypeResponse> getAllQuestionTypes();
    QuestionTypeResponse getQuestionType(String questionTypeName);
    QuestionType getQuestionTypeEntityByDescription(String description);
}
