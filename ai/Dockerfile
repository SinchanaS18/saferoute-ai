# Stage 1: Build the Spring Boot jar using Maven
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /workspace

# Copy Maven wrapper and pom first for dependency caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw
RUN ./mvnw -q -B -ntp dependency:go-offline

# Copy source files and package
COPY src ./src
RUN ./mvnw -q -B -ntp package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Use non-root user where possible
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /workspace/target/*.jar /app/app.jar

EXPOSE 8080

ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
