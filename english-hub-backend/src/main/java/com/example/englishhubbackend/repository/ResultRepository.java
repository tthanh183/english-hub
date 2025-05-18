package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Exam;
import com.example.englishhubbackend.models.Result;
import com.example.englishhubbackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ResultRepository extends JpaRepository<Result, UUID> {
    int countByUserAndExam(User user, Exam exam);

    @Query("SELECT MAX(r.listeningScore + r.readingScore) FROM Result r WHERE r.user = :user AND r.exam = :exam")
    Integer findHighestScoreByUserAndExam(@Param("user") User user, @Param("exam") Exam exam);
}
