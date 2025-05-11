package com.example.englishhubbackend.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

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

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL)
    List<FlashCard> flashCards;
}
