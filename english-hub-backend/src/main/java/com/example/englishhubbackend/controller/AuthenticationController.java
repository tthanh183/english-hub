package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.RegisterRequest;
import com.example.englishhubbackend.dto.request.VerifyRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.UserResponse;
import com.example.englishhubbackend.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody RegisterRequest registerRequest) {
        return ApiResponse.<UserResponse>builder().result(authenticationService.register(registerRequest)).build();
    }

    @PostMapping("/verify")
    public ApiResponse<String> verify(@RequestBody VerifyRequest verifyRequest) {
        authenticationService.verifyEmail(verifyRequest);
        return ApiResponse.<String>builder().message("Verified successfully").build();
    }

    @PostMapping("/resend")
    public ApiResponse<String> resend(@RequestParam String email) {
        authenticationService.resendVerificationCode(email);
        return ApiResponse.<String>builder().result("Verification code sent").build();
    }
}
