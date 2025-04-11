package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Exercise;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {
  List<Exercise> findAllByCourseIdOrderByCreatedAt(UUID courseId);

}
