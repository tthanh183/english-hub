package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.FlashCard;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlashCardRepository extends JpaRepository<FlashCard, UUID> {
  List<FlashCard> findAllByDeckId(UUID deckId);
}
