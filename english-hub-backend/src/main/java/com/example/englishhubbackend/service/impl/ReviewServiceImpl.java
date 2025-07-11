package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.ReviewRequest;
import com.example.englishhubbackend.dto.response.FlashCardResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.FlashCardMapper;
import com.example.englishhubbackend.models.FlashCard;
import com.example.englishhubbackend.models.Review;
import com.example.englishhubbackend.models.User;
import com.example.englishhubbackend.repository.FlashCardRepository;
import com.example.englishhubbackend.repository.ReviewRepository;
import com.example.englishhubbackend.service.AuthenticationService;
import com.example.englishhubbackend.service.ReviewService;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewServiceImpl implements ReviewService {
  ReviewRepository reviewRepository;
  AuthenticationService authenticationService;
  FlashCardRepository flashCardRepository;
  FlashCardMapper flashCardMapper;

    @Override
    public List<FlashCardResponse> getCardsToReviewToday() {
    User currentUser = authenticationService.getCurrentUser();

    List<Review> cards =
        reviewRepository.findByUserIdAndNextPracticeDateLessThanEqual(
            currentUser.getId(), LocalDate.now());

    return cards.stream()
        .map(Review::getFlashCard)
        .map(flashCardMapper::toFlashCardResponse)
        .collect(Collectors.toList());
  }

  @Override
  public void updateReview(ReviewRequest request) {
    User currentUser = authenticationService.getCurrentUser();

    if (currentUser == null) {
      throw new AppException(ErrorCode.USER_NOT_FOUND);
    }

    FlashCard flashCard =
        flashCardRepository
            .findById(request.getFlashCardId())
            .orElseThrow(() -> new AppException(ErrorCode.FLASHCARD_NOT_FOUND));

    Review userCard =
        reviewRepository
            .findByUserIdAndFlashCardId(currentUser.getId(), request.getFlashCardId())
            .orElseGet(
                () -> {
                  Review newCard = new Review();
                  newCard.setUser(currentUser);
                  newCard.setFlashCard(flashCard);
                  newCard.setEasinessFactor(2.5f);
                  newCard.setRepetitions(0);
                  newCard.setInterval(0);
                  newCard.setLastReviewedDate(null);
                  newCard.setNextPracticeDate(LocalDate.now());
                  return newCard;
                });

    int rating = request.getRating();
    int quality =
        switch (rating) {
          case 0 -> 0;
          case 1 -> 2;
          case 2 -> 3;
          case 3 -> 4;
          case 4 -> 5;
          default -> throw new IllegalArgumentException("Invalid rating");
        };

    // SM-2 Algorithm
    float ef = userCard.getEasinessFactor();
    int rep = userCard.getRepetitions();
    int interval = userCard.getInterval();

    if (quality < 3) {
      rep = 0;
      interval = 1;
    } else {
      if (rep == 0) {
        interval = 1;
      } else if (rep == 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * ef);
      }

      ef = ef + (0.1f - (5 - quality) * (0.08f + (5 - quality) * 0.02f));
      ef = Math.max(1.3f, ef);
      rep++;
    }

    userCard.setEasinessFactor(ef);
    userCard.setRepetitions(rep);
    userCard.setInterval(interval);
    userCard.setLastReviewedDate(LocalDate.now());
    userCard.setNextPracticeDate(LocalDate.now().plusDays(interval));

    reviewRepository.save(userCard);
  }
}
