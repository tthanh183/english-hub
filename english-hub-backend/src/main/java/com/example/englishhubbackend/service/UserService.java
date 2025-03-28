package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.UserCreateRequest;
import com.example.englishhubbackend.dto.request.UserUpdateRequest;
import com.example.englishhubbackend.dto.response.UserResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {
    boolean existsByEmail(String email);
    UserResponse deactivateUser(UUID userId);
    UserResponse activateUser(UUID userId);
    List<UserResponse> getAllUsers();
    UserResponse createUser(UserCreateRequest userCreateRequest);
    UserResponse updateUser(UUID userId, UserUpdateRequest userUpdateRequest);
}
