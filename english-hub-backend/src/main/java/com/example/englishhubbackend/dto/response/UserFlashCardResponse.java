package com.example.englishhubbackend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserFlashCardResponse {
    String id;
    String word;
    String meaning;
    int repetitions;
    int interval;
    float easinessFactor;
    LocalDate nextPracticeDate;
    LocalDate lastReviewedDate;
}
