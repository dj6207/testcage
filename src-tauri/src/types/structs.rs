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
    pub serial_number: String,
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

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct SignOutLogs {
    pub id: Option<i64>,
    #[serde(rename = "testSampleId")]
    pub test_sample_id: Option<i64>,
    #[serde(rename = "testFixtureId")]
    pub test_fixture_id: Option<i64>,
    #[serde(rename = "testSample")]
    pub test_sample: Option<String>,
    #[serde(rename = "testFixture")]
    pub test_fixture: Option<String>,
    #[serde(rename = "signedOutQuantity")]
    pub signed_out_quantity: i64,
    #[serde(rename = "signedOutBy")]
    pub signed_out_by: String,
    #[serde(rename = "dateSignedOut")]
    pub date_signed_out: Option<String>,
    #[serde(rename = "dateReturned")]
    pub date_returned: Option<String>,
}