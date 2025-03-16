package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.RegisterRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.UserResponse;
import com.example.englishhubbackend.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
