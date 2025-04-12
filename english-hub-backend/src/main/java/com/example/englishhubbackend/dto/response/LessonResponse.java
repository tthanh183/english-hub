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
public class LessonResponse {
  UUID id;
  String title;
  String content;
  Long duration;
  LocalDateTime createdDate;
}
