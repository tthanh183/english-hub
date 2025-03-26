package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.CourseCreateRequest;
import com.example.englishhubbackend.dto.response.CourseResponse;
import com.example.englishhubbackend.mapper.CourseMapper;
import com.example.englishhubbackend.repository.CourseRepository;
import com.example.englishhubbackend.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseServiceImpl implements CourseService {
    CourseRepository courseRepository;
    CourseMapper courseMapper;


    @Override
    public CourseResponse createCourse(CourseCreateRequest courseCreateRequest) {
        return courseMapper.toCourseResponse(courseRepository.save(courseMapper.toCourse(courseCreateRequest)));
    }
}
