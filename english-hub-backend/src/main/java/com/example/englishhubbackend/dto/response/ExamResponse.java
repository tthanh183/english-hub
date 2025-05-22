package com.example.englishhubbackend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExamResponse {
  UUID id;
  String title;
  int duration;
  LocalDateTime createdDate;
  int attempts;
  int highestScore;
}
