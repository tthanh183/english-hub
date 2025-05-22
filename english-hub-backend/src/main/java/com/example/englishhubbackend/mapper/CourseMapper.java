package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.CourseCreateRequest;
import com.example.englishhubbackend.dto.request.CourseUpdateRequest;
import com.example.englishhubbackend.dto.response.CourseResponse;
import com.example.englishhubbackend.models.Course;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseMapper {
  Course toCourse(CourseCreateRequest courseCreateRequest);

  CourseResponse toCourseResponse(Course course);

  void toCourse(CourseUpdateRequest courseUpdateRequest, @MappingTarget Course course);
}
