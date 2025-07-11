package com.example.englishhubbackend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Exercise {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  UUID id;

  String title;

  @Column(name = "created_at")
  LocalDateTime createdDate;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "course_id")
  Course course;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "exercise")
  @ToString.Exclude
  List<Question> questions;
}
