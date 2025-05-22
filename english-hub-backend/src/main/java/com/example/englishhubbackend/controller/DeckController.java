package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.DeckCreateRequest;
import com.example.englishhubbackend.dto.request.DeckUpdateRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.DeckResponse;
import com.example.englishhubbackend.service.DeckService;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/decks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DeckController {
  DeckService deckService;

  @PostMapping()
  public ApiResponse<DeckResponse> createDeck(@RequestBody DeckCreateRequest deckCreateRequest) {
    return ApiResponse.<DeckResponse>builder()
        .result(deckService.createDeck(deckCreateRequest))
        .build();
  }

  @GetMapping()
  public ApiResponse<List<DeckResponse>> getDecks() {
    return ApiResponse.<List<DeckResponse>>builder().result(deckService.getAllDecks()).build();
  }

  @GetMapping("/{deckId}")
  public ApiResponse<DeckResponse> getDeckById(@PathVariable String deckId) {
    return ApiResponse.<DeckResponse>builder()
        .result(deckService.getDeckById(UUID.fromString(deckId)))
        .build();
  }

  @PutMapping("/{deckId}")
  public ApiResponse<DeckResponse> updateDeck(
      @PathVariable String deckId, @RequestBody DeckUpdateRequest deckUpdateRequest) {
    return ApiResponse.<DeckResponse>builder()
        .result(deckService.updateDeck(UUID.fromString(deckId), deckUpdateRequest))
        .build();
  }

  @DeleteMapping("/{deckId}")
  public ApiResponse<Void> deleteDeck(@PathVariable String deckId) {
    deckService.deleteDeck(UUID.fromString(deckId));
    return ApiResponse.<Void>builder().message("Deck deleted successfully").build();
  }
}
