package com.example.englishhubbackend.mapper;

import com.example.englishhubbackend.dto.request.QuestionCreateRequest;
import com.example.englishhubbackend.dto.request.QuestionUpdateRequest;
import com.example.englishhubbackend.dto.response.QuestionResponse;
import com.example.englishhubbackend.models.ListeningQuestion;
import com.example.englishhubbackend.models.ReadingQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
  @Mapping(target = "questionType", ignore = true)
  ListeningQuestion toListeningQuestion(QuestionCreateRequest questionCreateRequest);

  @Mapping(target = "questionType", source = "questionType.name")
  @Mapping(target = "audioUrl", source = "audio.url")
  QuestionResponse toQuestionResponse(ListeningQuestion listeningQuestion);

  @Mapping(target = "questionType", ignore = true)
  @Mapping(target = "passage", ignore = true)
  ReadingQuestion toReadingQuestion(QuestionCreateRequest questionCreateRequest);

  @Mapping(target = "questionType", source = "questionType.name")
  @Mapping(target = "passage", source = "passage.content")
  QuestionResponse toQuestionResponse(ReadingQuestion readingQuestion);

  @Mapping(target = "audio", ignore = true)
  void toListeningQuestion(
      QuestionUpdateRequest questionUpdateRequest,
      @MappingTarget ListeningQuestion listeningQuestion);

  @Mapping(target = "passage", ignore = true)
  void toReadingQuestion(
      QuestionUpdateRequest questionUpdateRequest, @MappingTarget ReadingQuestion readingQuestion);
}
