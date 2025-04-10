package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.*;
import com.example.englishhubbackend.dto.response.AuthenticateResponse;
import com.example.englishhubbackend.dto.response.IntrospectResponse;
import com.example.englishhubbackend.dto.response.UserResponse;
import com.nimbusds.jose.JOSEException;
import java.text.ParseException;

public interface AuthenticationService {
  UserResponse register(RegisterRequest registerRequest);

  void verifyEmail(VerifyRequest verifyRequest);

  void resendVerificationCode(ResendVerificationRequest resendVerificationRequest);

  IntrospectResponse introspect(IntrospectRequest introspectRequest)
      throws JOSEException, ParseException;

  AuthenticateResponse authenticate(AuthenticateRequest authenticateRequest);

  AuthenticateResponse refreshToken(RefreshRequest refreshRequest);

  void logout(RefreshRequest refreshRequest);
}
