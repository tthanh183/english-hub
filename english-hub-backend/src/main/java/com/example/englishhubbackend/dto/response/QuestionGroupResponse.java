package com.example.englishhubbackend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

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
