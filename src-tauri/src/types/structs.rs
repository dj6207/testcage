use serde::{Deserialize, Serialize};
use sqlx::{Pool, Sqlite};
use std::sync::Mutex;

#[derive(Debug)]
pub struct SqlitePoolConnection{
    pub connection: Mutex<Option<Pool<Sqlite>>>
}

use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct TestSample {
    pub id: Option<i64>,
    pub name: String,
    pub quantity: i64,
    pub model: Option<String>,
    #[serde(rename = "serialNumber")]
    pub serial_number: i64,
    #[serde(rename = "projectAssociation")]
    pub project_association: Option<String>,
    #[serde(rename = "productEquivalence")]
    pub product_equivalence: Option<String>,
    pub misc: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct TestFixture {
    pub id: Option<i64>,
    pub name: String,
    pub quantity: i64,
    #[serde(rename = "projectAssociation")]
    pub project_association: Option<String>,
    pub misc: Option<String>,
}