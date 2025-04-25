package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.ExamCreateRequest;
import com.example.englishhubbackend.dto.request.ExamUpdateRequest;
import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.request.QuestionUpdateRequest;
import com.example.englishhubbackend.dto.response.ExamResponse;
import com.example.englishhubbackend.dto.response.QuestionGroupResponse;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.ExamMapper;
import com.example.englishhubbackend.models.Exam;
import com.example.englishhubbackend.models.ListeningQuestion;
import com.example.englishhubbackend.models.Question;
import com.example.englishhubbackend.models.ReadingQuestion;
import com.example.englishhubbackend.repository.ExamRepository;
import com.example.englishhubbackend.service.ExamService;
import com.example.englishhubbackend.service.QuestionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExamServiceImpl implements ExamService {
    ExamRepository examRepository;
    ExamMapper examMapper;
    QuestionService questionService;


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

    @Override
    public List<QuestionResponse> addQuestionsToExam(UUID examId, List<QuestionCreateRequest> questionCreateRequest) {
        Exam exam = examRepository
                .findById(examId)
                .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND));

        UUID groupId = UUID.randomUUID();

        List<QuestionResponse> questionResponses = new ArrayList<>();

        for(QuestionCreateRequest questionCreateRequestItem : questionCreateRequest) {
            Question question = questionService.createQuestionEntity(questionCreateRequestItem);

            question.setGroupId(groupId);

            question.setExam(exam);

            Question savedQuestion = questionService.saveQuestion(question);

            questionResponses.add(questionService.mapQuestionToResponse(savedQuestion));
        }
        return questionResponses;
    }

    @Override
    public QuestionResponse addQuestionToExam(UUID examId, QuestionCreateRequest questionCreateRequest) {
        Exam exam =
                examRepository
                        .findById(examId)
                        .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND));

        Question question = questionService.createQuestionEntity(questionCreateRequest);

        UUID groupId = UUID.randomUUID();
        question.setGroupId(groupId);

        question.setCreatedAt(LocalDateTime.now());
        question.setExam(exam);

        return questionService.mapQuestionToResponse(questionService.saveQuestion(question));
    }

    @Override
    public List<QuestionResponse> getAllQuestionsFromExam(UUID examId) {
        Exam exam =
                examRepository
                        .findById(examId)
                        .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND));

        return exam.getQuestions()
                .stream()
                .map(questionService::mapQuestionToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public QuestionResponse updateQuestionInExam(UUID examId, UUID questionId, QuestionUpdateRequest questionUpdateRequest) {
        Exam exam =
                examRepository
                        .findById(examId)
                        .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND));

        Question question = questionService.updateQuestionEntity(questionId, questionUpdateRequest);
        question.setExam(exam);
        return questionService.mapQuestionToResponse(questionService.saveQuestion(question));
    }

    @Override
    public List<QuestionGroupResponse> getQuestionGroupsFromExam(UUID examId) {
        Exam exam =
                examRepository
                        .findById(examId)
                        .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND));

        List<Question> questions = exam.getQuestions().stream()
                .sorted(Comparator.comparing(Question::getCreatedAt))
                .toList();

        Map<UUID, List<Question>> grouped = questions.stream()
                .collect(Collectors.groupingBy(
                        Question::getGroupId,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        List<QuestionGroupResponse> response = new ArrayList<>();

        for (Map.Entry<UUID, List<Question>> entry : grouped.entrySet()) {
            UUID groupId = entry.getKey();
            List<Question> groupQuestions = entry.getValue();

            QuestionGroupResponse groupResponse = new QuestionGroupResponse();
            groupResponse.setGroupId(groupId);
            groupResponse.setQuestions(groupQuestions.stream()
                    .map(questionService::mapQuestionToResponse)
                    .toList());

            Question first = groupQuestions.getFirst();
            if (first instanceof ListeningQuestion listening) {
                groupResponse.setAudioUrl(listening.getAudio().getUrl());
                groupResponse.setImageUrl(listening.getImageUrl());
            } else if (first instanceof ReadingQuestion reading) {
                groupResponse.setPassage(reading.getPassage().getContent());
            }

            response.add(groupResponse);
        }
        return response;
    }
}
