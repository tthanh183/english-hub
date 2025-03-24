package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.response.UserResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {
    boolean existsByEmail(String email);
    void deactivateUser(UUID userId);
    List<UserResponse> getAllUsers();
}
