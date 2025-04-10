package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.models.Audio;
import com.example.englishhubbackend.repository.AudioRepository;
import com.example.englishhubbackend.service.AudioService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AudioServiceImpl implements AudioService {
  AudioRepository audioRepository;

  @Override
  public void saveAudio(Audio audio) {
    audioRepository.save(audio);
  }
}
