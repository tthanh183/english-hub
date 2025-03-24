package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.response.UserResponse;
import com.example.englishhubbackend.enums.UserStatusEnum;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.models.User;
import com.example.englishhubbackend.repository.UserRepository;
import com.example.englishhubbackend.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public void deactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setStatus(UserStatusEnum.DEACTIVATED);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .enabled(user.isEnabled())
                        .verificationCode(user.getVerificationCode())
                        .verificationCodeExpiresAt(user.getVerificationCodeExpiresAt())
                        .role(user.getRole().getName())
                        .status(user.getStatus().name())
                        .joinDate(user.getJoinDate())
                        .build())
                .collect(Collectors.toList());
    }
}
