package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.RoleRequest;
import com.example.englishhubbackend.dto.response.RoleResponse;
import com.example.englishhubbackend.models.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
  Role toRole(RoleRequest roleRequest);

  RoleResponse toRoleResponse(Role role);
}
