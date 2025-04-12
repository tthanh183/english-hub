package com.example.englishhubbackend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuestionUpdateRequest {
    String title;
    MultipartFile image;
    MultipartFile audio;
    String passage;
    String choiceA;
    String choiceB;
    String choiceC;
    String choiceD;
    String correctAnswer;
}
