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
public class QuestionResponse {
  UUID id;
  String title;
  String questionType;
  LocalDateTime createdAt;
  String imageUrl;
  String audioUrl;
  String passage;
  String choiceA;
  String choiceB;
  String choiceC;
  String choiceD;
  String correctAnswer;
  UUID groupId;
}
