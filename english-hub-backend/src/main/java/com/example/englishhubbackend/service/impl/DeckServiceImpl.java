package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.DeckCreateRequest;
import com.example.englishhubbackend.dto.request.DeckUpdateRequest;
import com.example.englishhubbackend.dto.response.DeckResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.DeckMapper;
import com.example.englishhubbackend.models.Course;
import com.example.englishhubbackend.models.Deck;
import com.example.englishhubbackend.repository.DeckRepository;
import com.example.englishhubbackend.service.DeckService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DeckServiceImpl implements DeckService {
    DeckRepository deckRepository;
    DeckMapper deckMapper;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public DeckResponse createDeck(DeckCreateRequest deckCreateRequest) {
        Deck newDeck = deckMapper.toDeck(deckCreateRequest);
        newDeck.setCreatedDate(LocalDate.now());
        newDeck.setUpdatedDate(LocalDate.now());
        return deckMapper.toDeckResponse(deckRepository.save(newDeck));
    }

    @Override
    public List<DeckResponse> getAllDecks() {
        List<Deck> desks = deckRepository.findAllByOrderByCreatedDateAsc();
        return desks.stream().map(deckMapper::toDeckResponse).toList();
    }

    @Override
    public DeckResponse getDeckById(UUID id) {
        return deckRepository.findById(id)
                .map(deckMapper::toDeckResponse)
                .orElseThrow(() -> new AppException(ErrorCode.DECK_NOT_FOUND));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public DeckResponse updateDeck(UUID id, DeckUpdateRequest deckUpdateRequest) {
        Deck deck = deckRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DECK_NOT_FOUND));
        deckMapper.toDeck(deckUpdateRequest, deck);
        deck.setUpdatedDate(LocalDate.now());
        return deckMapper.toDeckResponse(deckRepository.save(deck));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteDeck(UUID id) {
        Deck deck = deckRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DECK_NOT_FOUND));
        deckRepository.delete(deck);
    }
}
