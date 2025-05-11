package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.FlashCardCreateRequest;
import com.example.englishhubbackend.dto.request.FlashCardUpdateRequest;
import com.example.englishhubbackend.dto.response.FlashCardResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.FlashCardMapper;
import com.example.englishhubbackend.models.Deck;
import com.example.englishhubbackend.models.FlashCard;
import com.example.englishhubbackend.repository.DeckRepository;
import com.example.englishhubbackend.repository.FlashCardRepository;
import com.example.englishhubbackend.service.FlashCardService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FlashCardServiceImpl implements FlashCardService {
    FlashCardRepository flashCardRepository;
    FlashCardMapper flashCardMapper;
    DeckRepository deckRepository;

    @Override
    public List<FlashCardResponse> getAllFlashCardsFromDecks(UUID deckId) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new AppException(ErrorCode.DECK_NOT_FOUND));
        return flashCardRepository.findAllByDeckId(deck.getId()).stream()
                .map(flashCardMapper::toFlashCardResponse)
                .toList();
    }

    @Override
    public FlashCardResponse getFlashCardById(UUID deckId, UUID flashCardId) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new AppException(ErrorCode.DECK_NOT_FOUND));
        return flashCardRepository.findById(flashCardId)
                .map(flashCardMapper::toFlashCardResponse)
                .orElseThrow(() -> new AppException(ErrorCode.FLASHCARD_NOT_FOUND));
    }

    @Override
    public FlashCardResponse createFlashCard(UUID deckId, FlashCardCreateRequest flashCardCreateRequest) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new AppException(ErrorCode.DECK_NOT_FOUND));
        FlashCard flashCard = flashCardMapper.toFlashCard(flashCardCreateRequest);
        flashCard.setDeck(deck);
        return flashCardMapper.toFlashCardResponse(flashCardRepository.save(flashCard));
    }

    @Override
    public FlashCardResponse updateFlashCard(UUID flashCardId, FlashCardUpdateRequest flashCardUpdateRequest) {
        return flashCardRepository.findById(flashCardId)
                .map(flashCard -> {
                    flashCardMapper.toFlashCard(flashCardUpdateRequest, flashCard);
                    return flashCardMapper.toFlashCardResponse(flashCardRepository.save(flashCard));
                })
                .orElseThrow(() -> new AppException(ErrorCode.FLASHCARD_NOT_FOUND));
    }

    @Override
    public void deleteFlashCard(UUID flashCardId) {
        if (!flashCardRepository.existsById(flashCardId)) {
            throw new AppException(ErrorCode.FLASHCARD_NOT_FOUND);
        }
        flashCardRepository.deleteById(flashCardId);
    }

}
