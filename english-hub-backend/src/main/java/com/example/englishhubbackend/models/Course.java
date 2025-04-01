package com.example.englishhubbackend.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    String title;
    String description;
    String imageUrl;
    @Column(name = "created_at")
    LocalDate createdDate;
    @Column(name = "updated_at")
    LocalDate updatedDate;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "course")
    List<Lesson> lessons;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "course")
    List<Exercise> exercises;
}
