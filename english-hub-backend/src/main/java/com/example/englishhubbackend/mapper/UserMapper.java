package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.RegisterRequest;
import com.example.englishhubbackend.dto.response.UserResponse;
import com.example.englishhubbackend.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(RegisterRequest registerRequest);
    @Mapping(source = "role.name", target = "role")
    @Mapping(source = "status", target = "status")
    UserResponse toUserResponse(User user);
}
