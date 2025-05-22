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
public class DeckResponse {
  UUID id;
  String name;
  String description;
  LocalDate createdDate;
  LocalDate updatedDate;
}
