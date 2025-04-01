package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findAllByCourseId(UUID courseId);
}
