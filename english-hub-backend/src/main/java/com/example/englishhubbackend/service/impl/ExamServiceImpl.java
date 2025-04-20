package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.ExamCreateRequest;
import com.example.englishhubbackend.dto.request.ExamUpdateRequest;
import com.example.englishhubbackend.dto.response.ExamResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.ExamMapper;
import com.example.englishhubbackend.models.Exam;
import com.example.englishhubbackend.repository.ExamRepository;
import com.example.englishhubbackend.service.ExamService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExamServiceImpl implements ExamService {
    ExamRepository examRepository;
    ExamMapper examMapper;


    @Override
    public ExamResponse createExam(ExamCreateRequest examCreateRequest) {
        Exam newExam = examMapper.toExam(examCreateRequest);
        newExam.setCreatedDate(LocalDateTime.now());
        return examMapper.toExamResponse(examRepository.save(newExam));
    }

    @Override
    public List<ExamResponse> getAllExams() {
        List<Exam> exams = examRepository.findAllByOrderByCreatedDateAsc();
        return exams.stream().map(examMapper::toExamResponse).collect(Collectors.toList());
    }

    @Override
    public ExamResponse getExamById(UUID examId) {
        return examMapper.toExamResponse(
                examRepository
                        .findById(examId)
                        .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND)));
    }

    @Override
    public ExamResponse updateExam(UUID examId, ExamUpdateRequest examUpdateRequest) {
        Exam exam = examRepository
                .findById(examId)
                .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND));
        examMapper.toExam(examUpdateRequest, exam);
        return examMapper.toExamResponse(examRepository.save(exam));
    }

    @Override
    public void deleteExam(UUID examId) {
        Exam exam = examRepository
                .findById(examId)
                .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND));
        examRepository.delete(exam);
    }
}
