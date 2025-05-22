package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.ReviewRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.FlashCardResponse;
import com.example.englishhubbackend.service.ReviewService;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {
  ReviewService reviewService;

  @GetMapping("/today")
  public ApiResponse<List<FlashCardResponse>> getTodayReviews() {
    return ApiResponse.<List<FlashCardResponse>>builder()
        .result(reviewService.getCardsToReviewToday())
        .build();
  }

  @PostMapping
  public ApiResponse<Void> review(@RequestBody ReviewRequest request) {
    reviewService.updateReview(request);
    return ApiResponse.<Void>builder().build();
  }
}
