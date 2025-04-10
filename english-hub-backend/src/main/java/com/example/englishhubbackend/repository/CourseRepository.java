package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Course;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
  List<Course> findAllByOrderByCreatedDateAsc();
}
