package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.dto.response.QuestionTypeResponse;
import com.example.englishhubbackend.service.QuestionTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/question-types")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QuestionTypeController {
     QuestionTypeService questionTypeService;

     @GetMapping("")
     public ApiResponse<List<QuestionTypeResponse>> getAllQuestionTypes() {
         return ApiResponse.<List<QuestionTypeResponse>>builder()
                 .result(questionTypeService.getAllQuestionTypes()).build();
     }

    @GetMapping("/{questionTypeName}")
    public ApiResponse<QuestionTypeResponse> getQuestionType(@PathVariable String questionTypeName) {
        return ApiResponse.<QuestionTypeResponse>builder()
                .result(questionTypeService.getQuestionType(questionTypeName)).build();
    }
}
