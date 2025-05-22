package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.FlashCardCreateRequest;
import com.example.englishhubbackend.dto.request.FlashCardUpdateRequest;
import com.example.englishhubbackend.dto.response.FlashCardResponse;
import com.example.englishhubbackend.models.FlashCard;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FlashCardMapper {
  FlashCard toFlashCard(FlashCardCreateRequest flashCardCreateRequest);

  FlashCardResponse toFlashCardResponse(FlashCard flashCard);

  @Mapping(target = "id", ignore = true)
  void toFlashCard(
      FlashCardUpdateRequest flashCardUpdateRequest, @MappingTarget FlashCard flashCard);
}
