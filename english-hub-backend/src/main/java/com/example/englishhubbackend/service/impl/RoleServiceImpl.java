package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.RoleRequest;
import com.example.englishhubbackend.dto.response.RoleResponse;
import com.example.englishhubbackend.mapper.RoleMapper;
import com.example.englishhubbackend.models.Role;
import com.example.englishhubbackend.repository.RoleRepository;
import com.example.englishhubbackend.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImpl implements RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;

    @Override
    public RoleResponse createRole(RoleRequest roleRequest) {
        Role role = roleMapper.toRole(roleRequest);
        roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream().map(roleMapper::toRoleResponse).toList();
    }

    @Override
    public Role getRole(String roleName) {
        return roleRepository.findById(roleName).orElse(null);
    }


}
