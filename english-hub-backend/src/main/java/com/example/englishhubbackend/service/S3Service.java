package com.example.englishhubbackend.service;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {
  public String uploadFileToS3(MultipartFile file);

  public void deleteFileFromS3(String fileName);
}
