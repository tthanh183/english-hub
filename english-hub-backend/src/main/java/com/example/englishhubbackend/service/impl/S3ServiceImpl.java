package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.service.S3Service;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class S3ServiceImpl implements S3Service {
    S3Client s3Client;

    @Value("${aws.s3.bucket}")
    @NonFinal
    private String bucketName;

    @Override
    public String uploadFileToS3(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        try {
        s3Client.putObject(PutObjectRequest.builder().bucket(bucketName)
                        .key(fileName).build(),
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to S3: " + e.getMessage());
        }
        return "https://" + bucketName + ".s3.amazonaws.com/" + fileName;
    }

    @Override
    public void deleteFileFromS3(String fileName) {
        s3Client.deleteObject(
                DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileName)
                        .build()
        );
    }
}
