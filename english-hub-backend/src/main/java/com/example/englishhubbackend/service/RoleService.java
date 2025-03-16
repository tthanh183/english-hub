package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.RoleRequest;
import com.example.englishhubbackend.dto.response.RoleResponse;
import com.example.englishhubbackend.models.Role;

import java.util.List;

public interface RoleService {
    RoleResponse createRole(RoleRequest roleRequest);
    List<RoleResponse> getAllRoles();
    Role getRole(String roleName);
}
