package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Lesson;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
  List<Lesson> findAllByCourseIdOrderByCreatedDate(UUID courseId);
}
