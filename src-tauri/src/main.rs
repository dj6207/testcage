// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
  Manager,
  State,
};
use std::sync::Mutex;
use crate::{
  types::structs::SqlitePoolConnection, 
  database::sqlite_connector::initialize_sqlite_database
};

mod database;
mod types;

pub fn setup_logging() -> Result<(), fern::InitError> {
  fern::Dispatch::new()
    .format(move |out, message, record| {
      out.finish(format_args!(
        "{}[{}][{}] - {}",
        chrono::Local::now().format("[%Y-%m-%d][%H:%M:%S]"),
        record.target(),
        record.level(),
        message
      ))
    })
    .chain(std::io::stdout())
    .chain(fern::log_file("output.log")?)
    .level(log::LevelFilter::Info)
    .apply()?;
  Ok(())
}

fn main() {
  if let Err(err) = setup_logging() {
    eprintln!("Error initializing logger: {}", err);
  }
  log::info!("Logging");
  tauri::Builder::default()
    .manage(SqlitePoolConnection{connection: Mutex::new(None)})    
    .plugin(database::sqlite_connector::init())
    .setup(|app_handler| {
      let app_handle = app_handler.app_handle();
      tauri::async_runtime::spawn(async move {
        match initialize_sqlite_database().await {
          Ok(pool) => {
            log::info!("Database initalized");
            let pool_state: State<'_, SqlitePoolConnection> = app_handle.state();
            *pool_state.connection.lock().unwrap() = Some(pool.clone());            
          }
          Err(err) => {log::error!("Error Initializing Database: {}", err);}
        }
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
