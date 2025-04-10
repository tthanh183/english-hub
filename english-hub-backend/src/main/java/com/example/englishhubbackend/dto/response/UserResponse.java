package com.example.englishhubbackend.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
  UUID id;
  String username;
  String email;
  boolean enabled;
  String verificationCode;
  LocalDateTime verificationCodeExpiresAt;
  String role;
  String status;
  LocalDate joinDate;
}
