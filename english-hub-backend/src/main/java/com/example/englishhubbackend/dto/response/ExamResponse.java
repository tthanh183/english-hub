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
public class ExamResponse {
    UUID id;
    String title;
    int duration;
    LocalDateTime createdDate;
    int attempts;
    int highestScore;
}
