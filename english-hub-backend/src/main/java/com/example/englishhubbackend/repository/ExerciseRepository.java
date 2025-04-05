package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
    List<Exercise> findAllByCourseId(UUID courseId);
}
