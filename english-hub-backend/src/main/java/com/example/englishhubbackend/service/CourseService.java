package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.CourseCreateRequest;
import com.example.englishhubbackend.dto.request.CourseUpdateRequest;
import com.example.englishhubbackend.dto.response.CourseResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface CourseService {
    CourseResponse createCourse(CourseCreateRequest courseCreateRequest);
    List<CourseResponse> getAllCourses();
    CourseResponse updateCourse(UUID courseId, CourseUpdateRequest courseUpdateRequest);

    void deleteCourse(UUID uuid);
}
