package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.ExerciseCreateRequest;
import com.example.englishhubbackend.dto.response.ExerciseResponse;
import com.example.englishhubbackend.models.Exercise;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExerciseMapper {
  Exercise toExercise(ExerciseCreateRequest exerciseCreateRequest);

  ExerciseResponse toExerciseResponse(Exercise exercise);
}
