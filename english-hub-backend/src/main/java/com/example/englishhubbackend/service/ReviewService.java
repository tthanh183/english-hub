package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.request.ReviewRequest;
import com.example.englishhubbackend.dto.response.UserFlashCardResponse;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    List<UserFlashCardResponse> getCardsToReviewToday();

    void updateReview(ReviewRequest request);
}
