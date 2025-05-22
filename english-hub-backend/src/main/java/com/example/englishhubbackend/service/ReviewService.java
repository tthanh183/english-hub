package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.ReviewRequest;
import com.example.englishhubbackend.dto.response.FlashCardResponse;
import java.util.List;

public interface ReviewService {
  List<FlashCardResponse> getCardsToReviewToday();

  void updateReview(ReviewRequest request);
}
