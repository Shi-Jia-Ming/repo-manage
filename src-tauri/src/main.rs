// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::Read;
use tauri::{command};
use crate::{utils::set_window_shadows};
use crate::service::configuration::{init_configuration, get_configuration};
use crate::service::file::{get_file_list, init_file_path};

mod utils;
mod service;

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![
          load_file, get_file_list, init_file_path,
          init_configuration, get_configuration])
    .setup(|app| {
      set_window_shadows(app);
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[command]
fn load_file(file_path: &str) -> String {
    let file = std::fs::File::open(file_path).unwrap();
    let reader = std::io::BufReader::new(file);
    let data: Vec<u8> = reader.bytes().map(|b| b.unwrap()).collect();

    base64::encode(data)
}
