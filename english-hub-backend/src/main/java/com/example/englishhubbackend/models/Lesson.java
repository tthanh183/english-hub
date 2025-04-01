package com.example.englishhubbackend.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    Course course;
}
