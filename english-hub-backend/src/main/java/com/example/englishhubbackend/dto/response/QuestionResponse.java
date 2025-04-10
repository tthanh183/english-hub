package com.example.englishhubbackend.dto.response;

import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionResponse {
  UUID id;
  String title;
  String questionType;
  String imageUrl;
  String audioUrl;
  String passage;
  String choiceA;
  String choiceB;
  String choiceC;
  String choiceD;
  String correctAnswer;
}
