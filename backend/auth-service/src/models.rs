use actix_web::{ Error };
use jsonwebtoken::{ encode, Header, EncodingKey };
use serde::{ Serialize, Deserialize };
use std::env;
use crate::errors::convert_jwt_error;

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LogInRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomerToken {
    pub email: String,
}

pub fn generate_token(email: &str) -> Result<String, Error> {
    let token_data = CustomerToken { email: email.to_owned() };
    let secret_key = env::var("SECRET_KEY").unwrap_or_else(|_| "default_secret_key".to_string());
    let encoding_key = EncodingKey::from_secret(secret_key.as_ref());
    let token = encode(&Header::default(), &token_data, &encoding_key).map_err(convert_jwt_error)?;

    Ok(token)
}
