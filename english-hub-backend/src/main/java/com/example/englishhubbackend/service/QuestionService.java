package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.models.Question;

public interface QuestionService {
    Question createQuestionEntity(QuestionCreateRequest questionCreateRequest);
    Question saveQuestion(Question question);
}
