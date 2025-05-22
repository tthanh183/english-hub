package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.ExamCreateRequest;
import com.example.englishhubbackend.dto.request.ExamUpdateRequest;
import com.example.englishhubbackend.dto.response.ExamResponse;
import com.example.englishhubbackend.models.Exam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ExamMapper {
  Exam toExam(ExamCreateRequest examCreateRequest);

  void toExam(ExamUpdateRequest examUpdateRequest, @MappingTarget Exam exam);

  @Mapping(target = "attempts", ignore = true)
  @Mapping(target = "highestScore", ignore = true)
  ExamResponse toExamResponse(Exam exam);
}
