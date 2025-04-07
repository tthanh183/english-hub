package com.example.englishhubbackend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionCreateRequest {
    String title;
    String questionType;
    LocalDate createdAt;
    String imageUrl;
    String audioUrl;
    String passage;
    String choiceA;
    String choiceB;
    String choiceC;
    String choiceD;
    String correctAnswer;
}
