package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.CourseCreateRequest;
import com.example.englishhubbackend.dto.request.CourseUpdateRequest;
import com.example.englishhubbackend.dto.response.CourseResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.CourseMapper;
import com.example.englishhubbackend.mapper.UserMapper;
import com.example.englishhubbackend.models.Course;
import com.example.englishhubbackend.repository.CourseRepository;
import com.example.englishhubbackend.service.CourseService;
import com.example.englishhubbackend.service.S3Service;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Override
    public List<CourseResponse> getAllCourses() {
        List<Course> courses = courseRepository.findAllByOrderByCreatedDateAsc();
        return courses.stream().map(courseMapper::toCourseResponse).collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public CourseResponse updateCourse(UUID courseId, CourseUpdateRequest courseUpdateRequest) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUD));
        courseMapper.toCourse(courseUpdateRequest, course);
        course.setUpdatedDate(LocalDate.now());
        return courseMapper.toCourseResponse(courseRepository.save(course));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCourse(UUID courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUD));
        courseRepository.delete(course);
    }

    @Override
    public Course getCourseEntityById(UUID courseId) {
        return courseRepository.findById(courseId).orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUD));
    }
}
