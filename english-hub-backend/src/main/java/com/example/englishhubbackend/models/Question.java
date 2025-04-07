package com.example.englishhubbackend.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.UUID;

@Data
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
    @OneToOne
    QuestionType questionType;
    @Column(name = "created_at")
    LocalDate createdAt;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = true)
    Exercise exercise;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = true)
    Exam exam;
    String choiceA;
    String choiceB;
    String choiceC;
    String choiceD;
    String correctAnswer;
}
