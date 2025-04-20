package com.example.englishhubbackend.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Exam {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  UUID id;

  String title;
  int duration;

  @Column(name = "created_at")
  LocalDateTime createdDate;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "exam")
  List<Result> results;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "exam")
  List<Question> questions;
}
