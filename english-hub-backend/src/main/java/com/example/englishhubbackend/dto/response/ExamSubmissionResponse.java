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
public class ExamSubmissionResponse {
  UUID id;
  UUID examId;
  UUID userId;
  LocalDateTime completedAt;
  int listeningScore;
  int readingScore;
  int totalScore;
  int maxScore;
}
