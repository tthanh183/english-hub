package com.example.englishhubbackend.exception;

import com.example.englishhubbackend.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(value = Exception.class)
  ResponseEntity<ApiResponse> handleRuntimeException(RuntimeException exception) {
    ApiResponse apiResponse = new ApiResponse();
    apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
    apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
    return ResponseEntity.badRequest().body(apiResponse);
  }

  @ExceptionHandler(value = AppException.class)
  ResponseEntity<ApiResponse> handleAppException(AppException exception) {
    ErrorCode errorCode = exception.getErrorCode();
    ApiResponse apiResponse = new ApiResponse();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(errorCode.getMessage());
    return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
  }

  @ExceptionHandler(value = AccessDeniedException.class)
  ResponseEntity<ApiResponse> handleAccessDeniedException(AccessDeniedException exception) {
    ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
    ApiResponse apiResponse = new ApiResponse();
    apiResponse.setCode(errorCode.getCode());
    apiResponse.setMessage(errorCode.getMessage());
    return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
  }
}
