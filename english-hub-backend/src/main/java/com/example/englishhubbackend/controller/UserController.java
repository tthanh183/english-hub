package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
