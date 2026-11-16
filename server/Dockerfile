# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Install bash to ensure Gradle wrapper runs smoothly in Alpine
RUN apk add --no-cache bash

# Copy Gradle wrapper and configuration files
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle settings.gradle ./

RUN chmod +x ./gradlew

# Pre-download dependencies to leverage Docker cache
RUN ./gradlew dependencies --no-daemon || true

# Copy source code and package the application
COPY src/ src/
RUN ./gradlew bootJar --no-daemon -x test

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser:appgroup

# Copy jar from builder
COPY --from=builder --chown=appuser:appgroup /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
