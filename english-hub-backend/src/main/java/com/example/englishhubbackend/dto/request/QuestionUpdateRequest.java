package com.example.englishhubbackend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionUpdateRequest {
  String title;
  String imageUrl;
  String audioUrl;
  String passage;
  String choiceA;
  String choiceB;
  String choiceC;
  String choiceD;
  String correctAnswer;
}
