package com.example.englishhubbackend.controller;

import com.example.englishhubbackend.dto.request.DeleteFileRequest;
import com.example.englishhubbackend.dto.response.ApiResponse;
import com.example.englishhubbackend.service.S3Service;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class S3Controller {
  S3Service s3Service;

  @PostMapping("/upload")
  public ApiResponse<String> uploadFile(@RequestPart("file") MultipartFile file) {
    String fileUrl = s3Service.uploadFileToS3(file);
    return ApiResponse.<String>builder().result(fileUrl).build();
  }

  @DeleteMapping("/delete")
  public ApiResponse<Void> deleteFile(@RequestBody DeleteFileRequest deleteFileRequest) {
    s3Service.deleteFileFromS3(deleteFileRequest.getFileName());
    return ApiResponse.<Void>builder().build();
  }
}
