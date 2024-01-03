use tauri::{
    command,
    plugin::{
        Builder, 
        TauriPlugin
    },
    Runtime
};

use sqlx::{
    sqlite::{
        SqliteConnectOptions,
        SqlitePool,
    },
    Pool, 
    Sqlite, 
    Error as SqlxError
};

use std::str::FromStr;

const DATABASE_URL:&str = "sqlite:testcage.db";

#[command]
async fn add_test_sample() {
    
}

#[command]
async fn add_test_fixture() {

}

pub async fn initialize_sqlite_database() -> Result<Pool<Sqlite>, SqlxError>{
    let connect_options = SqliteConnectOptions::from_str(DATABASE_URL)?
        .create_if_missing(true);
    let pool = SqlitePool::connect_with(connect_options).await?;
    sqlx::query(
        "
        CREATE TABLE IF NOT EXISTS TestSamples (
            TestSampleID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            Quantity INTEGER,
            Model TEXT,
            SerialNumber INTEGER UNIQUE,
            ProjectAssociation TEXT,
            ProductionEquivalence TEXT,
            Misc TEXT
        );

        CREATE TABLE IF NOT EXISTS TestFixtures (
            TestFixtureID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT UNIQUE,
            Quantity INTEGER,
            ProjectAssociation TEXT,
            Misc TEXT
        );
        "
    ).execute(&pool).await?;
    return Ok(pool);
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("sqlite_connector")
        .build()
}