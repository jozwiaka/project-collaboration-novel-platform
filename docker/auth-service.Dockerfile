FROM rust:latest

ENV DATABASE_URL=postgres://jozwiaka:password@db:5432/collaboration_novel_platform_db

WORKDIR /app
COPY backend/auth-service/. .
RUN cargo build --release
EXPOSE 8081

CMD ["./target/release/authentication_service"]

