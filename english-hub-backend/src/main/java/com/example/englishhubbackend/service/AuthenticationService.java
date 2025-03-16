package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.RegisterRequest;
import com.example.englishhubbackend.dto.response.UserResponse;

public interface AuthenticationService {
    UserResponse register(RegisterRequest registerRequest);
}
