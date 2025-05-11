package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.FlashCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface FlashCardRepository extends JpaRepository<FlashCard, UUID> {
    List<FlashCard> findAllByDeckId(UUID deckId);
}
