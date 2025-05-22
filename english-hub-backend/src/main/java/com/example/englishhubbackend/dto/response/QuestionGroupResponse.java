package com.example.englishhubbackend.dto.response;

import java.util.List;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionGroupResponse {
  UUID groupId;
  String questionType;
  String audioUrl;
  String imageUrl;
  String passage;
  List<QuestionResponse> questions;
}
