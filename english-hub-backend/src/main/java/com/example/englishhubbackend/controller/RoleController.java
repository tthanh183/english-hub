package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.RoleRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.RoleResponse;
import com.example.englishhubbackend.service.RoleService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {
  RoleService roleService;

  @PostMapping()
  ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest roleRequest) {
    return ApiResponse.<RoleResponse>builder().result(roleService.createRole(roleRequest)).build();
  }

  @GetMapping()
  ApiResponse<List<RoleResponse>> getAllRoles() {
    return ApiResponse.<List<RoleResponse>>builder().result(roleService.getAllRoles()).build();
  }
}
