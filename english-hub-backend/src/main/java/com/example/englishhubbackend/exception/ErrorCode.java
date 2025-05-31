package com.example.englishhubbackend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
  UNCATEGORIZED_EXCEPTION(
      9999,
      "An unexpected error occurred. Please try again later.",
      HttpStatus.INTERNAL_SERVER_ERROR),
  INVALID_KEY(
      1001, "The key provided is invalid. Please check and try again.", HttpStatus.BAD_REQUEST),
  USER_ALREADY_EXISTS(
      1002,
      "A user with this email already exists. Please use a different email or login.",
      HttpStatus.BAD_REQUEST),
  INVALID_EMAIL(
      1003,
      "The email address is not valid. Please check the format and try again.",
      HttpStatus.BAD_REQUEST),
  INVALID_PASSWORD(
      1004,
      "The password you entered is incorrect. Please check and try again.",
      HttpStatus.BAD_REQUEST),
  UNAUTHENTICATED(
      1005,
      "Incorrect username or password. Please check your credentials and try again.",
      HttpStatus.UNAUTHORIZED),
  UNAUTHORIZED(
      1006,
      "You do not have permission to access this resource. Please contact support if you believe this is a mistake.",
      HttpStatus.UNAUTHORIZED),
  EMAIL_SEND_FAILED(
      1007, "Failed to send the email. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR),
  VERIFICATION_CODE_EXPIRED(
      1008, "The verification code has expired. Please request a new one.", HttpStatus.BAD_REQUEST),
  INVALID_VERIFICATION_CODE(
      1009,
      "The verification code you entered is invalid. Please check and try again.",
      HttpStatus.BAD_REQUEST),
  USER_NOT_FOUND(
      1010,
      "User not found. Please check the email address and try again, or register if you don't have an account.",
      HttpStatus.NOT_FOUND),
  ACCOUNT_ALREADY_VERIFIED(1011, "Your account has already been verified.", HttpStatus.CONFLICT),
  ACCOUNT_UNVERIFIED(
      1012,
      "Your account is unverified. Please check your email for the verification code.",
      HttpStatus.CONFLICT),
  ACCOUNT_DEACTIVATED(
      1013,
      "Your account has been deactivated. Please contact support for more information.",
      HttpStatus.CONFLICT),
  FILE_UPLOAD_FAILED(
      1014,
      "There was an error uploading your file. Please try again.",
      HttpStatus.INTERNAL_SERVER_ERROR),
  COURSE_NOT_FOUND(
      1015, "Course not found. Please check the course ID and try again.", HttpStatus.NOT_FOUND),
  LESSON_NOT_FOUND(
      1016, "Lesson not found. Please check the lesson ID and try again.", HttpStatus.NOT_FOUND),
  EXERCISE_NOT_FOUND(
      1017,
      "Exercise not found. Please check the exercise ID and try again.",
      HttpStatus.NOT_FOUND),
  QUESTION_TYPE_NOT_FOUND(
      1018,
      "Question type not found. Please check the question type ID and try again.",
      HttpStatus.NOT_FOUND),
  QUESTION_TYPE_NOT_SUPPORTED(
      1019,
      "Question type not supported. Please check the question type and try again.",
      HttpStatus.BAD_REQUEST),
  QUESTION_NOT_FOUND(
      1020,
      "Question not found. Please check the question ID and try again.",
      HttpStatus.NOT_FOUND),
  EXAM_NOT_FOUND(
      1021, "Exam not found. Please check the exam ID and try again.", HttpStatus.NOT_FOUND),
  DECK_NOT_FOUND(
      1022, "Deck not found. Please check the deck ID and try again.", HttpStatus.NOT_FOUND),
  FLASHCARD_NOT_FOUND(
      1023,
      "Flashcard not found. Please check the flashcard ID and try again.",
      HttpStatus.NOT_FOUND),
  USER_FLASHCARD_NOT_FOUND(
      1024,
      "User flashcard not found. Please check the user ID and flashcard ID and try again.",
      HttpStatus.NOT_FOUND),
  INVALID_CURRENT_PASSWORD(
      1025,
      "The current password is incorrect. Please check and try again.",
      HttpStatus.BAD_REQUEST),
  ;

  private int code;
  private String message;
  private HttpStatusCode statusCode;

  ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
    this.code = code;
    this.message = message;
    this.statusCode = httpStatusCode;
  }
}
