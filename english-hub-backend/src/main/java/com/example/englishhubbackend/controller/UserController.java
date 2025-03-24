package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.UserResponse;
import com.example.englishhubbackend.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PatchMapping("/{userId}/deactivate")
    public ApiResponse<Void> deactivateUser(@PathVariable String userId) {
        userService.deactivateUser(UUID.fromString(userId));
        return ApiResponse.<Void>builder().message("User deactivated successfully").build();
    }

    @GetMapping("")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.<List<UserResponse>>builder().result(userService.getAllUsers()).build();
    }
}
