package com.example.englishhubbackend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid key", HttpStatus.BAD_REQUEST),
    USER_ALREADY_EXISTS(1002, "User already exists", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1003, "Invalid email", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Invalid password", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1005, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1006, "You do not have permission", HttpStatus.UNAUTHORIZED),
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
