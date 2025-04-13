package com.example.englishhubbackend.dto.request;

import java.time.LocalDate;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionCreateRequest {
  String title;
  String questionType;
  LocalDate createdAt;
  String audioUrl;
  String imageUrl;
  String passage;
  String choiceA;
  String choiceB;
  String choiceC;
  String choiceD;
  String correctAnswer;
}
