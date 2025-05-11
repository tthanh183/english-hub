package com.example.englishhubbackend.models;

import jakarta.persistence.*;

import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class FlashCard {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  UUID id;

  String word;

  String meaning;

  @ManyToOne
  @JoinColumn(name = "deck_id")
  private Deck deck;
}
