package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.RoleRequest;
import com.example.englishhubbackend.dto.response.RoleResponse;
import com.example.englishhubbackend.mapper.RoleMapper;
import com.example.englishhubbackend.models.Role;
import com.example.englishhubbackend.repository.RoleRepository;
import com.example.englishhubbackend.service.RoleService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImpl implements RoleService {
  RoleRepository roleRepository;
  RoleMapper roleMapper;

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public RoleResponse createRole(RoleRequest roleRequest) {
    Role role = roleMapper.toRole(roleRequest);
    roleRepository.save(role);
    return roleMapper.toRoleResponse(role);
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public List<RoleResponse> getAllRoles() {
    return roleRepository.findAll().stream().map(roleMapper::toRoleResponse).toList();
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public Role getRole(String roleName) {
    return roleRepository.findById(roleName).orElse(null);
  }
}
