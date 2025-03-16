package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.response.UserResponse;

public interface UserService {
    boolean existsByEmail(String email);
}
