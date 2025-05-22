package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.FlashCardCreateRequest;
import com.example.englishhubbackend.dto.request.FlashCardUpdateRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.FlashCardResponse;
import com.example.englishhubbackend.service.FlashCardService;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/decks/{deckId}/flashcards")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FlashCardController {
  FlashCardService flashCardService;

  @PostMapping()
  public ApiResponse<FlashCardResponse> createFlashCard(
      @PathVariable String deckId, @RequestBody FlashCardCreateRequest flashCardCreateRequest) {
    return ApiResponse.<FlashCardResponse>builder()
        .result(flashCardService.createFlashCard(UUID.fromString(deckId), flashCardCreateRequest))
        .build();
  }

  @GetMapping()
  public ApiResponse<List<FlashCardResponse>> getAllFlashCards(@PathVariable String deckId) {
    return ApiResponse.<List<FlashCardResponse>>builder()
        .result(flashCardService.getAllFlashCardsFromDecks(UUID.fromString(deckId)))
        .build();
  }

  @GetMapping("/{flashCardId}")
  public ApiResponse<FlashCardResponse> getFlashCardById(
      @PathVariable String deckId, @PathVariable String flashCardId) {
    return ApiResponse.<FlashCardResponse>builder()
        .result(
            flashCardService.getFlashCardById(
                UUID.fromString(deckId), UUID.fromString(flashCardId)))
        .build();
  }

  @PutMapping("/{flashCardId}")
  public ApiResponse<FlashCardResponse> updateFlashCard(
      @PathVariable String flashCardId,
      @RequestBody FlashCardUpdateRequest flashCardUpdateRequest) {
    return ApiResponse.<FlashCardResponse>builder()
        .result(
            flashCardService.updateFlashCard(UUID.fromString(flashCardId), flashCardUpdateRequest))
        .build();
  }

  @DeleteMapping("/{flashCardId}")
  public ApiResponse<String> deleteFlashCard(@PathVariable String flashCardId) {
    flashCardService.deleteFlashCard(UUID.fromString(flashCardId));
    return ApiResponse.<String>builder().message("Flashcard deleted successfully").build();
  }
}
