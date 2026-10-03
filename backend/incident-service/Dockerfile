# ==============================================================================
# Dockerfile para incident-service
# Multi-stage build con Eclipse Temurin JDK 21 Alpine
# ==============================================================================
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /workspace

# Copiar wrappers y configuración Gradle
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle settings.gradle gradle.properties ./

# Copiar módulos
COPY auth-user-service ./auth-user-service
COPY incident-service ./incident-service
COPY police-report-service ./police-report-service

RUN sed -i 's/\r$//' gradlew && chmod +x gradlew && ./gradlew :incident-service:bootJar -x test --no-daemon

# Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /workspace/incident-service/build/libs/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
