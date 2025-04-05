package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.ExerciseCreateRequest;
import com.example.englishhubbackend.dto.response.ExerciseResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.ExerciseMapper;
import com.example.englishhubbackend.models.Course;
import com.example.englishhubbackend.models.Exercise;
import com.example.englishhubbackend.repository.ExerciseRepository;
import com.example.englishhubbackend.service.CourseService;
import com.example.englishhubbackend.service.ExerciseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExerciseServiceImpl implements ExerciseService {
    ExerciseRepository exerciseRepository;
    ExerciseMapper exerciseMapper;
    CourseService courseService;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ExerciseResponse createExercise(UUID courseId, ExerciseCreateRequest exerciseCreateRequest) {
        Course course = courseService.getCourseEntityById(courseId);
        if (course == null) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUD);
        }
        Exercise exercise = exerciseMapper.toExercise(exerciseCreateRequest);
        exercise.setCourse(course);
        return exerciseMapper.toExerciseResponse(exerciseRepository.save(exercise));
    }

    @Override
    public List<ExerciseResponse> getAllExerciseFromCourse(UUID courseID) {
        return exerciseRepository.findAllByCourseId(courseID).stream()
                .map(exerciseMapper::toExerciseResponse).collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteExercise(UUID exerciseId) {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new AppException(ErrorCode.EXERCISE_NOT_FOUND));
        exerciseRepository.delete(exercise);
    }
}
