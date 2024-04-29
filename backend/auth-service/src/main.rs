use actix_web::{App, HttpServer};
mod handlers;
mod errors;
mod models;
mod db;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(move || {
        App::new()
        .configure(handlers::configure_routes)
    })
    .bind("0.0.0.0:8081")?
    .run()
    .await
}
