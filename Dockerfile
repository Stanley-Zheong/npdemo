FROM node:22-alpine AS web-build
WORKDIR /workspace/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-17 AS api-build
WORKDIR /workspace/backend
COPY backend/pom.xml ./
COPY backend/.mvn/ .mvn/
RUN mvn -B dependency:go-offline
COPY backend/src/ src/
COPY --from=web-build /workspace/frontend/dist/ src/main/resources/static/
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-noble
RUN groupadd --system app && useradd --system --gid app --home-dir /app --no-create-home app
WORKDIR /app
COPY --from=api-build /workspace/backend/target/npdemo-api.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
