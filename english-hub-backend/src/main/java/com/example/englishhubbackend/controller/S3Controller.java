package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.service.S3Service;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class S3Controller {
    S3Service s3Service;

    @GetMapping("/presigned-url")
    public ApiResponse<String> getPresignedUrl(@RequestParam String fileName) {
        String url = s3Service.generatePresignedUrl(fileName);
        return ApiResponse.<String>builder().result(url).build();
    }
}
