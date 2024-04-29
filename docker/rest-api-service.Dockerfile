FROM eclipse-temurin:17-jdk-focal

ENV SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/collaboration_novel_platform_db?useSSL=false&useUnicode=yes&characterEncoding=UTF-8&allowPublicKeyRetrieval=true&serverTimezone=UTC
ENV SPRING_DATASOURCE_USERNAME=jozwiaka
ENV SPRING_DATASOURCE_PASSWORD=password

WORKDIR /app

COPY backend/rest-api-service/.mvn/ .mvn
COPY backend/rest-api-service/mvnw backend/rest-api-service/pom.xml ./
COPY backend/rest-api-service/src/. src

RUN ./mvnw dependency:go-offline

EXPOSE 8080

CMD ["./mvnw", "spring-boot:run"]

