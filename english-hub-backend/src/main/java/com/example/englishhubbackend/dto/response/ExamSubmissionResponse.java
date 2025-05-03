package com.example.englishhubbackend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

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
