package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.LessonCreateRequest;
import com.example.englishhubbackend.dto.request.LessonUpdateRequest;
import com.example.englishhubbackend.dto.response.LessonResponse;
import java.util.List;
import java.util.UUID;

public interface LessonService {
  List<LessonResponse> getAllLessonsFromCourse(UUID courseId);

  LessonResponse createLesson(UUID courseId, LessonCreateRequest lessonCreateRequest);

  LessonResponse updateLesson(UUID lessonId, LessonUpdateRequest lessonUpdateRequest);

  void deleteLesson(UUID lessonId);

  LessonResponse getLessonById(UUID courseId, UUID lessonId);
}
