package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.FlashCardCreateRequest;
import com.example.englishhubbackend.dto.request.FlashCardUpdateRequest;
import com.example.englishhubbackend.dto.response.FlashCardResponse;

import java.util.List;
import java.util.UUID;

public interface FlashCardService {
    List<FlashCardResponse> getAllFlashCardsFromDecks(UUID deckId);

    FlashCardResponse createFlashCard(UUID deckId, FlashCardCreateRequest flashCardCreateRequest);

    FlashCardResponse updateFlashCard(UUID flashCardId, FlashCardUpdateRequest flashCardUpdateRequest);

    void deleteFlashCard(UUID flashCardId);

    FlashCardResponse getFlashCardById(UUID deckId , UUID flashCardId);
}
