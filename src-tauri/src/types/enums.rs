use serde::Serialize;
use thiserror::Error as ThisError;
use sqlx::Error as SqlxError;

#[derive(Debug, ThisError)]
pub enum SerializedError {
    #[error(transparent)]
    SerializedSqlxError(#[from] SqlxError),
}

impl Serialize for SerializedError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
      S: serde::ser::Serializer,
    {
      serializer.serialize_str(self.to_string().as_ref())
    }
}