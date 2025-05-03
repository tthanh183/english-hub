package com.example.englishhubbackend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Result {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  UUID id;

  int listeningScore;

  int readingScore;

  @JoinColumn(name = "last_completed_at")
  LocalDateTime lastCompletedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "exam_id")
  Exam exam;
}
