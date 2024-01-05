use chrono::Local;
use tauri::{
    command,
    AppHandle,
    plugin::{
        Builder, 
        TauriPlugin
    },
    Runtime,
    State,
    generate_handler, Manager,
};

use sqlx::{
    sqlite::{
        SqliteConnectOptions,
        SqlitePool,
    },
    Pool, 
    Sqlite, 
    Transaction,
    Error as SqlxError, Row
};

use std::str::FromStr;

use crate::types::{
    enums::SerializedError, 
    structs::{
        SqlitePoolConnection, 
        TestSample, TestFixture, SignOutLogs
    }
};

const DATABASE_URL:&str = "sqlite:testcage.db";

#[command]
async fn add_test_sample<R: Runtime>(app_handle: AppHandle<R>, pool_state: State<'_, SqlitePoolConnection>, item: TestSample) -> Result<i64, SerializedError>{
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let query = sqlx::query(
        "
        INSERT INTO TestSamples (Name, Quantity, Model, SerialNumber, ProjectAssociation, ProductionEquivalence, Misc) VALUES (?, ?, ?, ?, ?, ?, ?)
        "
    )
        .bind(item.name)
        .bind(item.quantity)
        .bind(item.model)
        .bind(item.serial_number)
        .bind(item.project_association)
        .bind(item.product_equivalence)
        .bind(item.misc)
        .execute(&pool)
        .await?;
    // Sends a message to the frontend to notify that the database is updated and should re-fetch new data
    app_handle.emit_all("database-update", "").expect("Failed to emit event");
    return Ok(query.last_insert_rowid());
}

#[command]
async fn add_test_fixture<R: Runtime>(app_handle: AppHandle<R>, pool_state: State<'_, SqlitePoolConnection>, item: TestFixture) -> Result<i64, SerializedError>{
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let query = sqlx::query(
        "
        INSERT INTO TestFixtures (Name, Quantity, ProjectAssociation, Misc) VALUES (?, ?, ?, ?)
        "
    )
        .bind(item.name)
        .bind(item.quantity)
        .bind(item.project_association)
        .bind(item.misc)
        .execute(&pool)
        .await?;
    app_handle.emit_all("database-update", "").expect("Failed to emit event");
    return Ok(query.last_insert_rowid());
}

// TODO 
// DO NOT USE SELECT * 
// THIS IS TEMP WILL TO FIX LATER
#[command]
async fn get_all_test_samples(pool_state: State<'_, SqlitePoolConnection>) -> Result<Vec<TestSample>, SerializedError> {
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let query = sqlx::query(
        "
        SELECT * FROM TestSamples
        "
    )
        .fetch_all(&pool)
        .await?;
    let test_samples:Vec<TestSample> = query.into_iter().map(|row| {
        TestSample {
            id: row.get(0),
            name: row.get(1),
            quantity: row.get(2),
            model: row.get(3),
            serial_number: row.get(4),
            project_association: row.get(5),
            product_equivalence: row.get(6),
            misc: row.get(7),
        }
    }).collect();

    return Ok(test_samples);
}

#[command]
async fn get_all_test_fixtures(pool_state: State<'_, SqlitePoolConnection>) -> Result<Vec<TestFixture>, SerializedError> {
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let query = sqlx::query(
        "
        SELECT * FROM TestFixtures
        "
    )
        .fetch_all(&pool)
        .await?;
    let test_fixture:Vec<TestFixture> = query.into_iter().map(|row| {
        TestFixture {
            id: row.get(0),
            name: row.get(1),
            quantity: row.get(2),
            project_association: row.get(3),
            misc: row.get(4),
        }
    }).collect();
    return Ok(test_fixture);
}

#[command]
async fn get_all_sign_out_logs(pool_state: State<'_, SqlitePoolConnection>) -> Result<Vec<SignOutLogs>, SerializedError> {
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let query = sqlx::query(
        "
        SELECT 
            sol.SignOutLogID, 
            sol.TestSampleID,
            sol.TestFixtureID,
            ts.NAME as TestSample, 
            tf.NAME as TestFixture, 
            sol.SignedOutQuantity, 
            sol.SignedOutBy, 
            sol.DateSignedOut, 
            sol.DateReturned
        FROM SignOutLogs sol
        LEFT JOIN TestSamples ts ON sol.TestSampleID = ts.TestSampleID
        LEFT JOIN TestFixtures tf ON sol.TestFixtureID = tf.TestFixtureID
        "
    )
        .fetch_all(&pool)
        .await?;
    let sign_out_logs: Vec<SignOutLogs> = query.into_iter().map(|row| {
        SignOutLogs {
            id: row.get(0),
            test_sample_id: row.get(1),
            test_fixture_id: row.get(2),
            test_sample: row.get(3),
            test_fixture: row.get(4),
            signed_out_quantity: row.get(5),
            signed_out_by: row.get(6),
            date_signed_out: row.get(7),
            date_returned: row.get(8),
        }
    }).collect();
    return Ok(sign_out_logs);
}

#[command]
async fn delete_sample_by_id<R: Runtime>(app_handle: AppHandle<R>, pool_state: State<'_, SqlitePoolConnection>, id:i64) -> Result<u64, SerializedError> {
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let mut transaction: Transaction<Sqlite> = pool.begin().await?;
    let query = sqlx::query(
        "
            DELETE FROM TestSamples WHERE TestSampleID = ?
        "
    )
        .bind(id)
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;
    app_handle.emit_all("database-update", "").expect("Failed to emit event");
    return Ok(query.rows_affected());
}

#[command]
async fn delete_fixture_by_id<R: Runtime>(app_handle: AppHandle<R>,pool_state: State<'_, SqlitePoolConnection>, id:i64) -> Result<u64, SerializedError> {
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let mut transaction: Transaction<Sqlite> = pool.begin().await?;
    let query = sqlx::query(
        "
            DELETE FROM TestFixtures WHERE TestFixtureID = ?
        "
    )
        .bind(id)
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;
    app_handle.emit_all("database-update", "").expect("Failed to emit event");
    return Ok(query.rows_affected());
}

#[command]
async fn sign_out_sample_by_id<R: Runtime>(app_handle: AppHandle<R>, pool_state: State<'_, SqlitePoolConnection>, id:i64, quantity:i64, user:String) -> Result<i64, SerializedError> {
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let mut transaction: Transaction<Sqlite> = pool.begin().await?;
    let query = sqlx::query(
        "
            UPDATE TestSamples
            SET Quantity = Quantity - ?
            WHERE TestSampleID = ?;
            INSERT INTO SignOutLogs (TestSampleID, SignedOutQuantity, SignedOutBy, DateSignedOut) VALUES (?, ?, ?, ?)
        "
    )
        .bind(quantity)
        .bind(id)
        .bind(id)
        .bind(quantity)
        .bind(user)
        .bind(Local::now().format("%Y-%m-%d").to_string())
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;
    app_handle.emit_all("database-update", "").expect("Failed to emit event");
    return Ok(query.last_insert_rowid());
}

#[command]
async fn sign_out_fixture_by_id<R: Runtime>(app_handle: AppHandle<R>, pool_state: State<'_, SqlitePoolConnection>, id:i64, quantity:i64, user:String) -> Result<i64, SerializedError> {
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let mut transaction: Transaction<Sqlite> = pool.begin().await?;
    let query = sqlx::query(
        "
            UPDATE TestFixtures
            SET Quantity = Quantity - ?              
            WHERE TestFixtureID = ?;
            INSERT INTO SignOutLogs (TestFixtureID, SignedOutQuantity, SignedOutBy, DateSignedOut) VALUES (?, ?, ?, ?)
        "
    )
        .bind(quantity)
        .bind(id)
        .bind(id)
        .bind(quantity)
        .bind(user)
        .bind(Local::now().format("%Y-%m-%d").to_string())
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;
    app_handle.emit_all("database-update", "").expect("Failed to emit event");
    return Ok(query.last_insert_rowid());
}

#[command]
async fn return_sample_by_id<R: Runtime>(app_handle: AppHandle<R>, pool_state: State<'_, SqlitePoolConnection>, id:i64, test_sample_id:i64, quantity:i64) -> Result<u64, SerializedError> {
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let mut transaction: Transaction<Sqlite> = pool.begin().await?;
    let query = sqlx::query(
        "
            UPDATE SignOutLogs
            SET DateReturned = ?
            WHERE SignOutLogID = ?;

            UPDATE TestSamples
            SET Quantity = Quantity + ?
            WHERE TestSampleID = ?;
        "
    )
        .bind(Local::now().format("%Y-%m-%d").to_string())
        .bind(id)
        .bind(quantity)
        .bind(test_sample_id)
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;
    app_handle.emit_all("database-update", "").expect("Failed to emit event");
    return Ok(query.rows_affected());
}

#[command]
async fn return_fixture_by_id<R: Runtime>(app_handle: AppHandle<R>, pool_state: State<'_, SqlitePoolConnection>, id:i64, test_fixture_id:i64, quantity:i64) -> Result<u64, SerializedError> {
    let pool = pool_state.connection.lock().unwrap().clone().unwrap();
    let mut transaction: Transaction<Sqlite> = pool.begin().await?;
    let query = sqlx::query(
        "
            UPDATE SignOutLogs
            SET DateReturned = ?
            WHERE SignOutLogID = ?;

            UPDATE TestFixtures
            SET Quantity = Quantity + ?
            WHERE TestFixtureID = ?;
        "
    )
        .bind(Local::now().format("%Y-%m-%d").to_string())
        .bind(id)
        .bind(quantity)
        .bind(test_fixture_id)
        .execute(&mut *transaction)
        .await?;  
    transaction.commit().await?;
    app_handle.emit_all("database-update", "").expect("Failed to emit event");
    return Ok(query.rows_affected());      
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
            SerialNumber TEXT UNIQUE,
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

        CREATE TABLE IF NOT EXISTS SignOutLogs (
            SignOutLogID INTEGER PRIMARY KEY AUTOINCREMENT,
            TestSampleID INTEGER,
            TestFixtureID INTEGER,
            SignedOutQuantity INTEGER,
            SignedOutBy TEXT,
            DateSignedOut DATE,
            DateReturned DATE,            
            FOREIGN KEY (TestSampleID) REFERENCES TestSamples(TestSampleID) ON DELETE SET NULL,
            FOREIGN KEY (TestFixtureID) REFERENCES TestFixtures(TestFixtureID) ON DELETE SET NULL
        );
        "
    ).execute(&pool).await?;
    return Ok(pool);
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::<R>::new("sqlite_connector")
        .invoke_handler(generate_handler![
            add_test_fixture,
            add_test_sample,
            get_all_test_samples,
            get_all_test_fixtures,
            delete_sample_by_id,
            delete_fixture_by_id,
            sign_out_sample_by_id,
            sign_out_fixture_by_id,
            get_all_sign_out_logs,
            return_sample_by_id,
            return_fixture_by_id,
        ])
        .build()
}