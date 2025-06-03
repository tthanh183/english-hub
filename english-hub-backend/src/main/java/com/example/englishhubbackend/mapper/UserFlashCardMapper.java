package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.response.UserFlashCardResponse;
import com.example.englishhubbackend.models.Review;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserFlashCardMapper {
  UserFlashCardResponse toUserFlashCardResponse(Review userFlashCard);
}
