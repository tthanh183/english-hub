package com.example.englishhubbackend.repository;

import com.example.englishhubbackend.models.Audio;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioRepository extends JpaRepository<Audio, UUID> {}
