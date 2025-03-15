package com.example.englishhubbackend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@PrimaryKeyJoinColumn(name = "id")
public class ListeningQuestion extends Question {
    @ManyToOne(fetch = FetchType.EAGER)
    Audio audio;
    String imageUrl;
    String choiceA;
    String choiceB;
    String choiceC;
    String choiceD;
    String correctAnswer;
}
