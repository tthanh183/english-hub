package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.response.QuestionTypeResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.QuestionTypeMapper;
import com.example.englishhubbackend.models.QuestionType;
import com.example.englishhubbackend.repository.QuestionTypeRepository;
import com.example.englishhubbackend.service.QuestionTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QuestionTypeServiceImpl implements QuestionTypeService {
    QuestionTypeRepository questionTypeRepository;
    QuestionTypeMapper questionTypeMapper;


    @Override
    public List<QuestionTypeResponse> getAllQuestionTypes() {
        return questionTypeRepository.findAll().stream()
                .map(questionTypeMapper::toQuestionTypeResponse)
                .toList();
    }

    @Override
    public QuestionTypeResponse getQuestionType(String questionTypeName) {
        return questionTypeRepository.findById(questionTypeName)
                .map(questionTypeMapper::toQuestionTypeResponse)
                .orElse(null);
    }

    @Override
    public QuestionType getQuestionTypeEntityByDescription(String description) {
        return questionTypeRepository.findByDescription(description)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_TYPE_NOT_FOUND));
    }
}
