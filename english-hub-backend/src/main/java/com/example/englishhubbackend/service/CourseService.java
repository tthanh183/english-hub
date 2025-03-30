package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.CourseCreateRequest;
import com.example.englishhubbackend.dto.response.CourseResponse;

import java.io.IOException;
import java.util.List;

public interface CourseService {
    CourseResponse createCourse(CourseCreateRequest courseCreateRequest);
    List<CourseResponse> getAllCourses();
}
