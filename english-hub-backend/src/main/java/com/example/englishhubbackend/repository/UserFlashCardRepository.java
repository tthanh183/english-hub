package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.UserFlashCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserFlashCardRepository extends JpaRepository<UserFlashCard, UUID> {
}
