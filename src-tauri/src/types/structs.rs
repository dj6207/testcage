use sqlx::{Pool, Sqlite};
use std::sync::Mutex;

#[derive(Debug)]
pub struct SqlitePoolConnection{
    pub connection: Mutex<Option<Pool<Sqlite>>>
}