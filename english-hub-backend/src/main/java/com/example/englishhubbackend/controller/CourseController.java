package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.CourseCreateRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.CourseResponse;
import com.example.englishhubbackend.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseController {
    CourseService courseService;

    @PostMapping("")
    public ApiResponse<CourseResponse> createCourse(@RequestBody CourseCreateRequest courseCreateRequest) {
        return ApiResponse.<CourseResponse>builder().result(courseService.createCourse(courseCreateRequest)).build();
    }

    @GetMapping("")
    public ApiResponse<List<CourseResponse>> getAllCourses() {
        return ApiResponse.<List<CourseResponse>>builder().result(courseService.getAllCourses()).build();
    }
}
