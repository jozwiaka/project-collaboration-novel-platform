use actix_web::{ web, HttpResponse, Error };
use bcrypt::verify;
use serde_json::json;
use actix_cors::Cors;
use crate::models::{ RegisterRequest, LogInRequest };
use crate::models::generate_token;
use crate::errors::{ convert_postgres_error, convert_bcrypt_error };
use crate::db::create_postgres_client;

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web
            ::scope("/api")
            .wrap(Cors::permissive().allowed_origin("http://localhost:4200").max_age(3600))
            .route("/register", web::post().to(register_handler))
            .route("/login", web::post().to(login_handler))
    );
}

async fn register_handler(credentials: web::Json<RegisterRequest>) -> Result<HttpResponse, Error> {
    let hashed_password = bcrypt
        ::hash(&credentials.password, bcrypt::DEFAULT_COST)
        .map_err(convert_bcrypt_error)?;
    let client = create_postgres_client().await?;
    let stmt = client
        .prepare(
            "INSERT INTO usr (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, password_hash"
        ).await
        .map_err(convert_postgres_error)?;
    let row = client
        .query_one(&stmt, &[&credentials.name, &credentials.email, &hashed_password]).await
        .map_err(convert_postgres_error)?;

    let id: i32 = row.get(0);
    let name: String = row.get(1);
    let email: String = row.get(2);
    let password_hash: String = row.get(3);

    Ok(
        HttpResponse::Ok().json(
            json!({
        "message": "User registered successfully",
        "id": id,
        "name": name,
        "email": email,
        "password_hash": password_hash
    })
        )
    )
}

async fn login_handler(credentials: web::Json<LogInRequest>) -> Result<HttpResponse, Error> {
    let client = create_postgres_client().await?;
    let stmt = client
        .prepare(
            "SELECT id, name, email, password_hash, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') AS updated_at FROM usr WHERE email = $1"
        ).await
        .map_err(convert_postgres_error)?;
    let row = match
        client.query_opt(&stmt, &[&credentials.email]).await.map_err(convert_postgres_error)?
    {
        Some(row) => row,
        None => {
            return Ok(
                HttpResponse::Unauthorized().json(
                    json!({
                        "error": "Invalid credentials"
                    })
                )
            );
        }
    };

    let id: i32 = row.get(0);
    let name: String = row.get(1);
    let email: String = row.get(2);
    let password_hash: String = row.get(3);
    let created_at: String = row.get(4);
    let updated_at: String = row.get(5);

    if verify(&credentials.password, &password_hash).map_err(convert_bcrypt_error)? {
        let token = generate_token(&email)?;

        return Ok(
            HttpResponse::Ok().json(
                json!({
                    "user": {
                        "id": id,
                        "name": name,
                        "email": email,
                        "createdAt": created_at,
                        "updatedAt": updated_at,
                    },
                    "token": token
                })
            )
        );
    }

    Ok(HttpResponse::Unauthorized().json(json!({
        "error": "Invalid credentials"
    })))
}
