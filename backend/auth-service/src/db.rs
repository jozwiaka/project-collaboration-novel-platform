use tokio_postgres::{NoTls, Client};
use std::env;
use crate::errors::PostgresWrapperError;

pub async fn create_postgres_client() -> Result<Client, PostgresWrapperError> {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set");
    let (client, connection) = tokio_postgres::connect(&database_url, NoTls).await?;
    tokio::spawn(async {
        if let Err(e) = connection.await {
            eprintln!("PostgreSQL connection error: {}", e);
        }
    });
    Ok(client)
}