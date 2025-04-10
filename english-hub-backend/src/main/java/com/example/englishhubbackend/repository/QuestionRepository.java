package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Question;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, UUID> {}
