package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.CourseCreateRequest;
import com.example.englishhubbackend.dto.response.CourseResponse;

public interface CourseService {
    CourseResponse createCourse(CourseCreateRequest courseCreateRequest);
}
