package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.response.QuestionTypeResponse;

import java.util.List;

public interface QuestionTypeService {
    List<QuestionTypeResponse> getAllQuestionTypes();
    QuestionTypeResponse getQuestionType(String questionTypeName);
}
