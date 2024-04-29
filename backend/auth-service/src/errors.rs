use tokio_postgres::Error as PostgresError;
use bcrypt::BcryptError;
use actix_web::{HttpResponse};
use actix_web::error::ResponseError;
use std::fmt;

#[derive(Debug)]
pub struct PostgresWrapperError(PostgresError);

impl ResponseError for PostgresWrapperError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        actix_web::http::StatusCode::INTERNAL_SERVER_ERROR
    }

    fn error_response(&self) -> actix_web::HttpResponse {
        actix_web::HttpResponse::InternalServerError().body(format!("PostgreSQL error: {}", self.0))
    }
}

impl fmt::Display for PostgresWrapperError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "PostgreSQL error: {}", self.0)
    }
}

pub fn convert_postgres_error(error: PostgresError) -> PostgresWrapperError {
    PostgresWrapperError(error)
}

#[derive(Debug)]
pub struct BcryptWrapperError(BcryptError);

impl ResponseError for BcryptWrapperError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        actix_web::http::StatusCode::INTERNAL_SERVER_ERROR
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::InternalServerError().body(format!("Bcrypt error: {}", self.0))
    }
}

impl fmt::Display for BcryptWrapperError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Bcrypt error: {}", self.0)
    }
}

pub fn convert_bcrypt_error(error: BcryptError) -> BcryptWrapperError {
    BcryptWrapperError(error)
}

#[derive(Debug)]
pub struct JwtWrapperError(jsonwebtoken::errors::Error);

impl ResponseError for JwtWrapperError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        actix_web::http::StatusCode::INTERNAL_SERVER_ERROR
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::InternalServerError().body(format!("JWT error: {}", self.0))
    }
}

impl fmt::Display for JwtWrapperError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "JWT error: {}", self.0)
    }
}

// Function to convert JwtError to JwtWrapperError
pub fn convert_jwt_error(error: jsonwebtoken::errors::Error) -> JwtWrapperError {
    JwtWrapperError(error)
}

impl From<tokio_postgres::Error> for PostgresWrapperError {
    fn from(error: tokio_postgres::Error) -> Self {
        PostgresWrapperError(error)
    }
}