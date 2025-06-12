package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Review;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
  List<Review> findByUserIdAndNextPracticeDateLessThanEqual(UUID userId, LocalDate date);

  Optional<Review> findByUserIdAndFlashCardId(UUID userId, UUID flashCardId);
}
