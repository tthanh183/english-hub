package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.CourseCreateRequest;
import com.example.englishhubbackend.dto.request.CourseUpdateRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.CourseResponse;
import com.example.englishhubbackend.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseController {
    CourseService courseService;

    @PostMapping("")
    public ApiResponse<CourseResponse> createCourse(@RequestBody CourseCreateRequest request) {
        return ApiResponse.<CourseResponse>builder().result(courseService.createCourse(request)).build();
    }

    @GetMapping("")
    public ApiResponse<List<CourseResponse>> getAllCourses() {
        return ApiResponse.<List<CourseResponse>>builder().result(courseService.getAllCourses()).build();
    }

    @PutMapping("/{courseId}")
    public ApiResponse<CourseResponse> updateCourse(@PathVariable String courseId, @RequestBody CourseUpdateRequest courseUpdateRequest) {
        return ApiResponse.<CourseResponse>builder().result(courseService.updateCourse(UUID.fromString(courseId), courseUpdateRequest)).build();
    }

    @DeleteMapping("/{courseId}")
    public ApiResponse<Void> deleteCourse(@PathVariable String courseId) {
        courseService.deleteCourse(UUID.fromString(courseId));
        return ApiResponse.<Void>builder().message("Course deleted successfully").build();
    }

}
