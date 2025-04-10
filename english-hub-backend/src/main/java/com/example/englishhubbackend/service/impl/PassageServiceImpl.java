package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.models.Passage;
import com.example.englishhubbackend.repository.PassageRepository;
import com.example.englishhubbackend.service.PassageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PassageServiceImpl implements PassageService {
    PassageRepository passageRepository;


    @Override
    public void savePassage(Passage passage) {
        passageRepository.save(passage);
    }
}
