package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.LessonCreateRequest;
import com.example.englishhubbackend.dto.response.LessonResponse;
import com.example.englishhubbackend.models.Lesson;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    Lesson toLesson(LessonCreateRequest lessonCreateRequest);
    LessonResponse toLessonResponse(Lesson lesson);
}
