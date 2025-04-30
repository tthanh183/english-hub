package com.example.englishhubbackend.models;

import jakarta.persistence.*;

import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Passage {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  UUID id;

  @Column(columnDefinition = "TEXT")
  String content;
}
