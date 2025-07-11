package com.example.englishhubbackend.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Deck {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  UUID id;

  String name;

  String description;

  @Column(name = "created_at")
  LocalDate createdDate;

  @Column(name = "updated_at")
  LocalDate updatedDate;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "deck")
  List<FlashCard> flashCards;
}
