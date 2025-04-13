package com.example.englishhubbackend.models;

import jakarta.persistence.*;
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
  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  Audio audio;

  String imageUrl;
}
