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
    EMAIL_SEND_FAILED(1007, "Email send failed", HttpStatus.INTERNAL_SERVER_ERROR),
    VERIFICATION_CODE_EXPIRED(1008,"Verification code has expired" , HttpStatus.BAD_REQUEST ),
    INVALID_VERIFICATION_CODE(1009, "Invalid verification code", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1010, "User not found", HttpStatus.NOT_FOUND),
    ACCOUNT_ALREADY_VERIFIED(1011, "Account already verified", HttpStatus.CONFLICT),
    ACCOUNT_UNVERIFIED(1012, "Account unverified", HttpStatus.CONFLICT),
    ACCOUNT_DEACTIVATED(1013, "Account deactivated", HttpStatus.CONFLICT),
    FILE_UPLOAD_FAILED(1014, "File upload failed", HttpStatus.INTERNAL_SERVER_ERROR),;
    private int code;
    private String message;
    private HttpStatusCode statusCode;
    ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = httpStatusCode;
    }
}
