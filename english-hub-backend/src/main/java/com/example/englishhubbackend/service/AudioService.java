package com.example.englishhubbackend.service;

import com.example.englishhubbackend.dto.response.AudioResponse;
import com.example.englishhubbackend.models.Audio;

public interface AudioService {
    void saveAudio(Audio audio);
}
