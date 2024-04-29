FROM postgres:latest

ENV POSTGRES_DB collaboration_novel_platform_db
ENV POSTGRES_USER jozwiaka
ENV POSTGRES_PASSWORD password

COPY db/database_setup.sql /docker-entrypoint-initdb.d/

VOLUME ["/var/lib/postgresql/data"]

EXPOSE 5432