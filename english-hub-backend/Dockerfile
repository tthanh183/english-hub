# Bước 1: Sử dụng image Gradle với JDK 21 để build ứng dụng
FROM gradle:8.13.0-jdk21 as builder

# Bước 2: Sao chép mã nguồn vào container
WORKDIR /app
COPY . .

# Bước 3: Build ứng dụng Spring Boot
RUN gradle build --no-daemon -x test

# Bước 4: Chạy ứng dụng
FROM openjdk:21-jdk-slim

# Sao chép file JAR đã build từ builder vào image chính
COPY --from=builder /app/build/libs/*.jar /app/app.jar

# Chạy ứng dụng Spring Boot
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
