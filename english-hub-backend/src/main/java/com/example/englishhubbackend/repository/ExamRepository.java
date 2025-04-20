package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExamRepository extends JpaRepository<Exam, UUID> {
    List<Exam> findAllByOrderByCreatedDateAsc();
}
