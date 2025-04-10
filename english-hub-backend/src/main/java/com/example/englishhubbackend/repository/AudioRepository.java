package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Audio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AudioRepository extends JpaRepository<Audio, UUID> {
}
