package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.DeckCreateRequest;
import com.example.englishhubbackend.dto.request.DeckUpdateRequest;
import com.example.englishhubbackend.dto.response.DeckResponse;
import com.example.englishhubbackend.models.Deck;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DeckMapper {
  Deck toDeck(DeckCreateRequest deckCreateRequest);

  DeckResponse toDeckResponse(Deck deck);

  void toDeck(DeckUpdateRequest deckUpdateRequest, @MappingTarget Deck deck);
}
