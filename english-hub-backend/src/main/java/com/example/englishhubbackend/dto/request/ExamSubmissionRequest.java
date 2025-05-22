package com.example.englishhubbackend.dto.request;

import java.util.Map;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExamSubmissionRequest {
  Map<String, String> answers;
}
