package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.LessonCreateRequest;
import com.example.englishhubbackend.dto.request.LessonUpdateRequest;
import com.example.englishhubbackend.dto.response.LessonResponse;
import com.example.englishhubbackend.models.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    Lesson toLesson(LessonCreateRequest lessonCreateRequest);
    LessonResponse toLessonResponse(Lesson lesson);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    void toLesson(LessonUpdateRequest lessonUpdateRequest, @MappingTarget Lesson lesson);
}
