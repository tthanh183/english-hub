package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.CourseCreateRequest;
import com.example.englishhubbackend.dto.request.CourseUpdateRequest;
import com.example.englishhubbackend.dto.response.CourseResponse;
import com.example.englishhubbackend.models.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseMapper {
  Course toCourse(CourseCreateRequest courseCreateRequest);

  CourseResponse toCourseResponse(Course course);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdDate", ignore = true)
  @Mapping(target = "updatedDate", ignore = true)
  @Mapping(target = "lessons", ignore = true)
  @Mapping(target = "exercises", ignore = true)
  void toCourse(CourseUpdateRequest courseUpdateRequest, @MappingTarget Course course);
}
