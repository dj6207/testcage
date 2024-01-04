use tauri::{
    command,
    plugin::{
        Builder, 
        TauriPlugin
    },
    Runtime,
    State,
    generate_handler,
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

use crate::types::{
    enums::SerializedError, 
    structs::{
        SqlitePoolConnection, 
        TestSample, TestFixture
    }
};

const DATABASE_URL:&str = "sqlite:testcage.db";

#[command]
async fn add_test_sample(pool_state: State<'_, SqlitePoolConnection>, sample: TestSample) -> Result<i64, SerializedError>{
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let query = sqlx::query(
        "
        INSERT INTO TestSamples (Name, Quantity, Model, SerialNumber, ProjectAssociation, ProductionEquivalence, Misc) VALUES (?, ?, ?, ?, ?, ?, ?)
        "
    )
        .bind(sample.name)
        .bind(sample.quantity)
        .bind(sample.model)
        .bind(sample.serial_number)
        .bind(sample.project_association)
        .bind(sample.product_equivalence)
        .bind(sample.misc)
        .execute(&pool)
        .await?;
    return Ok(query.last_insert_rowid());
}

#[command]
async fn add_test_fixture(pool_state: State<'_, SqlitePoolConnection>, fixture: TestFixture) -> Result<i64, SerializedError>{
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let query = sqlx::query(
        "
        INSERT INTO TestFixtures (Name, Quantity, ProjectAssociation, Misc) VALUES (?, ?, ?, ?)
        "
    )
        .bind(fixture.name)
        .bind(fixture.quantity)
        .bind(fixture.project_association)
        .bind(fixture.misc)
        .execute(&pool)
        .await?;
    return Ok(query.last_insert_rowid());
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
        .invoke_handler(generate_handler![
            add_test_fixture,
            add_test_sample,
        ])
        .build()
}