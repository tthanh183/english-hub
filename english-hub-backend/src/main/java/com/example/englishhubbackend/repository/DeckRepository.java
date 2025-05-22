package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Deck;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeckRepository extends JpaRepository<Deck, UUID> {
  List<Deck> findAllByOrderByCreatedDateAsc();
}
