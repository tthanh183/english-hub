package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.LessonCreateRequest;
import com.example.englishhubbackend.dto.request.LessonUpdateRequest;
import com.example.englishhubbackend.dto.response.LessonResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.LessonMapper;
import com.example.englishhubbackend.models.Course;
import com.example.englishhubbackend.models.Lesson;
import com.example.englishhubbackend.repository.LessonRepository;
import com.example.englishhubbackend.service.CourseService;
import com.example.englishhubbackend.service.LessonService;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LessonServiceImpl implements LessonService {
  LessonRepository lessonRepository;
  LessonMapper lessonMapper;
  CourseService courseService;

  @Override
  public List<LessonResponse> getAllLessonsFromCourse(UUID courseId) {
    return lessonRepository.findAllByCourseIdOrderByCreatedAt(courseId).stream()
        .map(lessonMapper::toLessonResponse)
        .toList();
  }

  @Override
  public LessonResponse createLesson(UUID courseId, LessonCreateRequest lessonCreateRequest) {
    Course course = courseService.getCourseEntityById(courseId);
    if (course == null) {
      throw new AppException(ErrorCode.COURSE_NOT_FOUND);
    }
    Lesson lesson = lessonMapper.toLesson(lessonCreateRequest);
    lesson.setCreatedAt(LocalDate.now());
    lesson.setCourse(course);
    return lessonMapper.toLessonResponse(lessonRepository.save(lesson));
  }

  @Override
  public LessonResponse updateLesson(UUID lessonId, LessonUpdateRequest lessonUpdateRequest) {
    Lesson lesson =
        lessonRepository
            .findById(lessonId)
            .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
    lessonMapper.toLesson(lessonUpdateRequest, lesson);
    return lessonMapper.toLessonResponse(lessonRepository.save(lesson));
  }

  @Override
  public void deleteLesson(UUID lessonId) {
    Lesson lesson =
        lessonRepository
            .findById(lessonId)
            .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));
    lessonRepository.delete(lesson);
  }
}
