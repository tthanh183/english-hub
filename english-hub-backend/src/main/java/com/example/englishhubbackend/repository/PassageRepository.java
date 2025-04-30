package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Passage;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassageRepository extends JpaRepository<Passage, UUID> {
    Passage findByContent(String passage);
}
