package com.example.englishhubbackend.util;

import java.util.Random;

public class VerificationCodeUtil {
  private static final int CODE_LENGTH = 6;

  public static String generateVerificationCode() {
    Random random = new Random();
    StringBuilder code = new StringBuilder(CODE_LENGTH);
    for (int i = 0; i < CODE_LENGTH; i++) {
      code.append(random.nextInt(10));
    }
    return code.toString();
  }
}
