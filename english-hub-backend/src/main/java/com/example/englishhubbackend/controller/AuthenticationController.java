package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.*;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.AuthenticateResponse;
import com.example.englishhubbackend.dto.response.IntrospectResponse;
import com.example.englishhubbackend.dto.response.UserResponse;
import com.example.englishhubbackend.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import java.text.ParseException;

import jakarta.validation.Valid;
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
  public ApiResponse<UserResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
    return ApiResponse.<UserResponse>builder()
        .result(authenticationService.register(registerRequest))
        .build();
  }

  @PostMapping("/verify")
  public ApiResponse<String> verify(@RequestBody VerifyRequest verifyRequest) {
    authenticationService.verifyEmail(verifyRequest);
    return ApiResponse.<String>builder().message("Verified successfully").build();
  }

  @PostMapping("/resend")
  public ApiResponse<String> resend(
      @RequestBody ResendVerificationRequest resendVerificationRequest) {
    authenticationService.resendVerificationCode(resendVerificationRequest);
    return ApiResponse.<String>builder().message("Verification code sent").build();
  }

  @PostMapping("/login")
  public ApiResponse<AuthenticateResponse> authenticate(
      @RequestBody AuthenticateRequest authenticateRequest) {
    var result = authenticationService.authenticate(authenticateRequest);
    return ApiResponse.<AuthenticateResponse>builder().result(result).build();
  }

  @PostMapping("/refresh")
  public ApiResponse<AuthenticateResponse> refresh(@RequestBody RefreshRequest request) {
    var result = authenticationService.refreshToken(request);
    return ApiResponse.<AuthenticateResponse>builder().result(result).build();
  }

  @PostMapping("/logout")
  public ApiResponse<String> logout(@RequestBody RefreshRequest request) {
    authenticationService.logout(request);
    return ApiResponse.<String>builder().message("Logged out").build();
  }

  @PostMapping("/introspect")
  ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request)
      throws ParseException, JOSEException {
    var result = authenticationService.introspect(request);
    return ApiResponse.<IntrospectResponse>builder().result(result).build();
  }

  @PostMapping("/change-password")
  public ApiResponse<String> changePassword(
      @RequestBody ChangePasswordRequest changePasswordRequest) {
    authenticationService.changePassword(changePasswordRequest);
    return ApiResponse.<String>builder().message("Password changed successfully").build();
  }
}
