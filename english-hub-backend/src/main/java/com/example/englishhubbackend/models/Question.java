package com.example.englishhubbackend.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Question {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  UUID id;

  String title;

  @ManyToOne
  QuestionType questionType;

  @Column(name = "created_at")
  LocalDate createdAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "exercise_id", nullable = true)
  @ToString.Exclude
  Exercise exercise;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "exam_id", nullable = true)
  Exam exam;

  String choiceA;
  String choiceB;
  String choiceC;
  String choiceD;
  String correctAnswer;

  @Column(name = "group_id")
  private UUID groupId;
}
