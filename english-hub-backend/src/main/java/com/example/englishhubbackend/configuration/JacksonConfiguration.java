package com.example.englishhubbackend.configuration;

import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.format.DateTimeFormatter;

@Configuration
public class JacksonConfiguration {
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        return jackson2ObjectMapperBuilder -> {
            // formatter
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter dateTimeFormatter =  DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

            // deserializers
            jackson2ObjectMapperBuilder.deserializers(new LocalDateDeserializer(dateFormatter));
            jackson2ObjectMapperBuilder.deserializers(new LocalDateTimeDeserializer(dateTimeFormatter));

            // serializers
            jackson2ObjectMapperBuilder.serializers(new LocalDateSerializer(dateFormatter));
            jackson2ObjectMapperBuilder.serializers(new LocalDateTimeSerializer(dateTimeFormatter));
        };
    }
}
