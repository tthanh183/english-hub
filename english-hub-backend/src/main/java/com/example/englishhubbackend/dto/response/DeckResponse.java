package com.example.englishhubbackend.dto.response;

import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.UUID;

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
