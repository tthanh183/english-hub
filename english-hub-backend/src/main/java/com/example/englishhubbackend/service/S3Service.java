package com.example.englishhubbackend.service;

public interface S3Service {
    String generatePresignedUrl(String fileName);
}
