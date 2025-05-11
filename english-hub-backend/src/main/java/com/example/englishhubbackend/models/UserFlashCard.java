package com.example.englishhubbackend.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFlashCard {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flash_card_id", nullable = false)
    private FlashCard flashCard;

    private int repetitions = 0;

    private float easinessFactor = 2.5f;

    private int interval = 0;

    private LocalDate nextPracticeDate = LocalDate.now();

    private LocalDate lastReviewedDate;
}
