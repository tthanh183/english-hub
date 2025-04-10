package com.example.englishhubbackend.dto.response;

import java.time.LocalDate;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseResponse {
  UUID id;
  String title;
  String description;
  String imageUrl;
  LocalDate createdDate;
  LocalDate updatedDate;
}
