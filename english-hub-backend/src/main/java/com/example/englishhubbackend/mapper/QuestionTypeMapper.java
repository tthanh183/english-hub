package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.response.QuestionTypeResponse;
import com.example.englishhubbackend.models.Question;
import com.example.englishhubbackend.models.QuestionType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuestionTypeMapper {
    QuestionTypeResponse toQuestionTypeResponse(QuestionType questionType);
}
