use serde::Serialize;
use thiserror::Error as ThisError;
use sqlx::Error as SqlxError;
use csv::Error as CsvError;
use std::io::Error as IOError;

#[derive(Debug)]
pub enum SqliteTypes {
    SqliteText(String),
    SqliteInteger(i64),
}

#[derive(Debug, ThisError)]
pub enum SerializedError {
    #[error(transparent)]
    SerializedSqlxError(#[from] SqlxError),
    #[error(transparent)]
    SerializedCsvError(#[from] CsvError),
    #[error(transparent)]
    SerializeIOError(#[from] IOError)
}

impl Serialize for SerializedError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
      S: serde::ser::Serializer,
    {
      serializer.serialize_str(self.to_string().as_ref())
    }
}