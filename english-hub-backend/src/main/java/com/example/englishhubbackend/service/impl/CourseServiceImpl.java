package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.CourseCreateRequest;
import com.example.englishhubbackend.dto.response.CourseResponse;
import com.example.englishhubbackend.mapper.CourseMapper;
import com.example.englishhubbackend.models.Course;
import com.example.englishhubbackend.repository.CourseRepository;
import com.example.englishhubbackend.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseServiceImpl implements CourseService {
    CourseRepository courseRepository;
    CourseMapper courseMapper;


    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public CourseResponse createCourse(CourseCreateRequest courseCreateRequest) {
        Course newCourse = courseMapper.toCourse(courseCreateRequest);
        newCourse.setCreatedDate(LocalDate.now());
        newCourse.setUpdatedDate(LocalDate.now());
        return courseMapper.toCourseResponse(courseRepository.save(newCourse));
    }
}
