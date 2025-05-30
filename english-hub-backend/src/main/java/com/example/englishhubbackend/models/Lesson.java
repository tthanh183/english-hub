package com.example.englishhubbackend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Lesson {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  UUID id;

  String title;

  @Column(length = 5000)
  String content;

  Long duration;

  @Column(name = "created_at")
  LocalDateTime createdDate;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "course_id")
  Course course;
}
