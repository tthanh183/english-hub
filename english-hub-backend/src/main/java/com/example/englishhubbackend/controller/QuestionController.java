package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.service.QuestionService;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QuestionController {
  QuestionService questionService;

  @GetMapping("/group/{groupId}")
  public ApiResponse<List<QuestionResponse>> getAllQuestionByGroupId(@PathVariable String groupId) {
    return ApiResponse.<List<QuestionResponse>>builder()
        .result(questionService.getQuestionsByGroupId(UUID.fromString(groupId)))
        .build();
  }
}
