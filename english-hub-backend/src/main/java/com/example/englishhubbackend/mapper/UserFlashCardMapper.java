package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.response.UserFlashCardResponse;
import com.example.englishhubbackend.models.UserFlashCard;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserFlashCardMapper {
  UserFlashCardResponse toUserFlashCardResponse(UserFlashCard userFlashCard);
}
