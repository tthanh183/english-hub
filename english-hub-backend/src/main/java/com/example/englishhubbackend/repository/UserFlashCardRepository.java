package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.UserFlashCard;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserFlashCardRepository extends JpaRepository<UserFlashCard, UUID> {
  List<UserFlashCard> findByUserIdAndNextPracticeDateLessThanEqual(UUID userId, LocalDate date);

  Optional<UserFlashCard> findByUserIdAndFlashCardId(UUID userId, UUID flashCardId);
}
