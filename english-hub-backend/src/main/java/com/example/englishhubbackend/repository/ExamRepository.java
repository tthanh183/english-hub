package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Exam;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamRepository extends JpaRepository<Exam, UUID> {
  List<Exam> findAllByOrderByCreatedDateAsc();
}
