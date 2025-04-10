package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Passage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PassageRepository extends JpaRepository<Passage, UUID> {
}
