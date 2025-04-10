package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.models.ListeningQuestion;
import com.example.englishhubbackend.models.ReadingQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    @Mapping(target = "questionType", ignore = true)
    ListeningQuestion toListeningQuestion(QuestionCreateRequest questionCreateRequest);

    @Mapping(target = "questionType", source = "questionType.name")
    QuestionResponse toQuestionResponse(ListeningQuestion listeningQuestion);

    @Mapping(target = "questionType", ignore = true)
    @Mapping(target = "passage", ignore = true)
    ReadingQuestion toReadingQuestion(QuestionCreateRequest questionCreateRequest);

    @Mapping(target = "questionType", source = "questionType.name")
    @Mapping(target = "passage", source = "passage.content")
    QuestionResponse toQuestionResponse(ReadingQuestion readingQuestion);

}
