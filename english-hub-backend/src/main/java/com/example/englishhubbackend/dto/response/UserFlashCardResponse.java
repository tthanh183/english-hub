package com.example.englishhubbackend.dto.response;

import java.time.LocalDate;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
