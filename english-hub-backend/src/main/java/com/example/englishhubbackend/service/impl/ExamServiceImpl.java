package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.*;
import com.example.englishhubbackend.dto.response.ExamResponse;
import com.example.englishhubbackend.dto.response.ExamSubmissionResponse;
import com.example.englishhubbackend.dto.response.QuestionGroupResponse;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.ExamMapper;
import com.example.englishhubbackend.models.*;
import com.example.englishhubbackend.repository.ExamRepository;
import com.example.englishhubbackend.repository.ResultRepository;
import com.example.englishhubbackend.repository.UserRepository;
import com.example.englishhubbackend.service.ExamService;
import com.example.englishhubbackend.service.QuestionService;
import com.example.englishhubbackend.util.ToeicScoringUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
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
    UserRepository userRepository;
    ResultRepository resultRepository;


    @Override
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ExamResponse updateExam(UUID examId, ExamUpdateRequest examUpdateRequest) {
        Exam exam = examRepository
                .findById(examId)
                .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND));
        examMapper.toExam(examUpdateRequest, exam);
        return examMapper.toExamResponse(examRepository.save(exam));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteExam(UUID examId) {
        Exam exam = examRepository
                .findById(examId)
                .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND));
        examRepository.delete(exam);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
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
                .sorted(Comparator.comparing(Question::getCreatedAt))
                .map(questionService::mapQuestionToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
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
                if(reading.getPassage() != null) {
                    groupResponse.setPassage(reading.getPassage().getContent());
                }
            }
            groupResponse.setQuestionType(first.getQuestionType().getName());
            response.add(groupResponse);
        }
        return response;
    }

    @Override
    public ExamSubmissionResponse submitExam(UUID examId, ExamSubmissionRequest examSubmissionRequest) {
        Exam exam =
                examRepository
                        .findById(examId)
                        .orElseThrow(() -> new AppException(ErrorCode.EXAM_NOT_FOUND));

        Map<UUID, Question> questionMap = exam.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, question -> question));

        int correctListeningAnswers = 0;
        int correctReadingAnswers = 0;

        if (examSubmissionRequest.getAnswers() != null && !examSubmissionRequest.getAnswers().isEmpty()) {
            for (Map.Entry<String, String> entry : examSubmissionRequest.getAnswers().entrySet()) {
                UUID questionId = UUID.fromString(entry.getKey());
                String submittedAnswer = entry.getValue();

                Question question = questionMap.get(questionId);
                if (question == null) {
                    throw new AppException(ErrorCode.QUESTION_NOT_FOUND);
                }

                if (question.getCorrectAnswer().equalsIgnoreCase(submittedAnswer)) {
                    if (question instanceof ListeningQuestion) {
                        correctListeningAnswers++;
                    } else if (question instanceof ReadingQuestion) {
                        correctReadingAnswers++;
                    }
                }
            }
        }

        int listeningScore = ToeicScoringUtil.convertListeningScore(correctListeningAnswers);
        int readingScore = ToeicScoringUtil.convertReadingScore(correctReadingAnswers);

        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();
        User currentUser = userRepository
                .findById(UUID.fromString(userId))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Result result = Result.builder()
                .listeningScore(listeningScore)
                .readingScore(readingScore)
                .lastCompletedAt(LocalDateTime.now())
                .user(currentUser)
                .exam(exam)
                .build();

        resultRepository.save(result);

        return ExamSubmissionResponse.builder()
                .id(result.getId())
                .examId(exam.getId())
                .userId(currentUser.getId())
                .completedAt(result.getLastCompletedAt())
                .listeningScore(result.getListeningScore())
                .readingScore(result.getReadingScore())
                .totalScore(result.getListeningScore() + result.getReadingScore())
                .maxScore(990)
                .build();
    }

}
