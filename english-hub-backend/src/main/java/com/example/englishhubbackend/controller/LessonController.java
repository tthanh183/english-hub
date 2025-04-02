package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.LessonCreateRequest;
import com.example.englishhubbackend.dto.request.LessonUpdateRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.LessonResponse;
import com.example.englishhubbackend.service.LessonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses/{courseId}/lessons")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LessonController {
     LessonService lessonService;
     @PostMapping("")
     public ApiResponse<LessonResponse> createLesson(@PathVariable String courseId, @RequestBody LessonCreateRequest lessonCreateRequest) {
         return ApiResponse.<LessonResponse>builder().result(lessonService.createLesson(UUID.fromString(courseId), lessonCreateRequest)).build();
     }

     @GetMapping("")
     public ApiResponse<List<LessonResponse>> getAllLessons(@PathVariable String courseId) {
         return ApiResponse.<List<LessonResponse>>builder()
                 .result(lessonService.getAllLessonsFromCourse(UUID.fromString(courseId))).build();
     }

     @PutMapping("/{lessonId}")
     public ApiResponse<LessonResponse> updateLesson(@PathVariable String lessonId, @RequestBody LessonUpdateRequest lessonUpdateRequest) {
         return ApiResponse.<LessonResponse>builder()
                 .result(lessonService.updateLesson(UUID.fromString(lessonId), lessonUpdateRequest)).build();
     }
}
