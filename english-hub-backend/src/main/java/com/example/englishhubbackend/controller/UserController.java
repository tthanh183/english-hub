package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.UserCreateRequest;
import com.example.englishhubbackend.dto.request.UserUpdateRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.UserResponse;
import com.example.englishhubbackend.service.UserService;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
  UserService userService;

  @PatchMapping("/{userId}/deactivate")
  public ApiResponse<UserResponse> deactivateUser(@PathVariable String userId) {
    return ApiResponse.<UserResponse>builder()
        .result(userService.deactivateUser(UUID.fromString(userId)))
        .build();
  }

  @PatchMapping("/{userId}/activate")
  public ApiResponse<UserResponse> activateUser(@PathVariable String userId) {
    return ApiResponse.<UserResponse>builder()
        .result(userService.activateUser(UUID.fromString(userId)))
        .build();
  }

  @GetMapping("")
  public ApiResponse<List<UserResponse>> getAllUsers() {
    return ApiResponse.<List<UserResponse>>builder().result(userService.getAllUsers()).build();
  }

  @PostMapping("")
  public ApiResponse<UserResponse> createUser(@RequestBody UserCreateRequest userCreateRequest) {
    return ApiResponse.<UserResponse>builder()
        .result(userService.createUser(userCreateRequest))
        .build();
  }

  @PutMapping("/{userId}")
  public ApiResponse<UserResponse> updateUser(
      @PathVariable String userId, @RequestBody UserUpdateRequest userUpdateRequest) {
    return ApiResponse.<UserResponse>builder()
        .result(userService.updateUser(UUID.fromString(userId), userUpdateRequest))
        .build();
  }
}
