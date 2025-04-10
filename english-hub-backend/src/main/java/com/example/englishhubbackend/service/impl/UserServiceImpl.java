package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.UserCreateRequest;
import com.example.englishhubbackend.dto.request.UserUpdateRequest;
import com.example.englishhubbackend.dto.response.UserResponse;
import com.example.englishhubbackend.enums.UserStatusEnum;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.UserMapper;
import com.example.englishhubbackend.models.User;
import com.example.englishhubbackend.repository.UserRepository;
import com.example.englishhubbackend.service.RoleService;
import com.example.englishhubbackend.service.UserService;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
  UserRepository userRepository;
  UserMapper userMapper;
  PasswordEncoder passwordEncoder;
  RoleService roleService;

  @Override
  public boolean existsByEmail(String email) {
    return userRepository.existsByEmail(email);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public UserResponse deactivateUser(UUID userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    user.setStatus(UserStatusEnum.DEACTIVATED);
    return userMapper.toUserResponse(userRepository.save(user));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public UserResponse activateUser(UUID userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    user.setStatus(UserStatusEnum.ACTIVE);
    return userMapper.toUserResponse(userRepository.save(user));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public List<UserResponse> getAllUsers() {
    return userRepository.findAll().stream()
        .map(userMapper::toUserResponse)
        .collect(Collectors.toList());
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public UserResponse createUser(UserCreateRequest userCreateRequest) {
    User user = userMapper.toUser(userCreateRequest, roleService);
    user.setJoinDate(LocalDate.now());
    user.setStatus(UserStatusEnum.ACTIVE);
    user.setPassword(passwordEncoder.encode("12345678"));
    user.setEnabled(true);
    return userMapper.toUserResponse(userRepository.save(user));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public UserResponse updateUser(UUID userId, UserUpdateRequest userUpdateRequest) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    userMapper.updateUser(userUpdateRequest, user, roleService);
    return userMapper.toUserResponse(userRepository.save(user));
  }
}
