package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.DeckCreateRequest;
import com.example.englishhubbackend.dto.request.DeckUpdateRequest;
import com.example.englishhubbackend.dto.response.DeckResponse;

import java.util.List;
import java.util.UUID;

public interface DeckService {
    DeckResponse createDeck(DeckCreateRequest deckCreateRequest);

    DeckResponse getDeckById(UUID id);

    List<DeckResponse> getAllDecks();

    DeckResponse updateDeck(UUID id, DeckUpdateRequest deckUpdateRequest);

    void deleteDeck(UUID id);
}
