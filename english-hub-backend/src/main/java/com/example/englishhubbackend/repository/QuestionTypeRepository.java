package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionTypeRepository extends JpaRepository<QuestionType, String> {
    Optional<QuestionType> findByDescription(String description);
}
