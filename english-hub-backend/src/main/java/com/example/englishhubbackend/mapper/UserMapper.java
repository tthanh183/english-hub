package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.RegisterRequest;
import com.example.englishhubbackend.dto.request.UserCreateRequest;
import com.example.englishhubbackend.dto.request.UserUpdateRequest;
import com.example.englishhubbackend.dto.response.UserResponse;
import com.example.englishhubbackend.models.Role;
import com.example.englishhubbackend.models.User;
import com.example.englishhubbackend.service.RoleService;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
  User toUser(RegisterRequest registerRequest);

  @Mapping(source = "role.name", target = "role")
  @Mapping(source = "status", target = "status")
  UserResponse toUserResponse(User user);

  @Mapping(source = "role", target = "role")
  User toUser(UserCreateRequest userCreateRequest, @Context RoleService roleService);

  @Mapping(source = "role", target = "role")
  void updateUser(
      UserUpdateRequest userUpdateRequest,
      @MappingTarget User user,
      @Context RoleService roleService);

  default Role mapRole(String roleName, @Context RoleService roleService) {
    return roleService.getRole(roleName);
  }
}
