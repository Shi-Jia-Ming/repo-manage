// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::Read;
use std::path::PathBuf;
use tauri::{command};
use crate::{utils::set_window_shadows};

mod utils;

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![load_file, save_file, get_file_list, init_file_path])
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

#[command]
fn get_file_list(file_path: &str) -> Vec<String> {
    let data_dir = PathBuf::from(file_path);
    let file_path = data_dir.join(file_path);
    let entries = std::fs::read_dir(file_path).unwrap();
    let mut file_list = Vec::new();
    for entry in entries {
        let entry = entry.unwrap();
        let path = entry.path();
        let file_name = path.file_name().unwrap().to_str().unwrap().to_string();
        file_list.push(file_name);
    }
    file_list
}

#[command]
fn init_file_path(file_path: &str) {
    let data_dir = PathBuf::from(file_path);
    if !data_dir.exists() {
        std::fs::create_dir_all(data_dir).unwrap();
    }
}

#[command]
fn save_file(file_name: &str, data: String) {
    // 获取 dataDir
    let data_dir = tauri::api::path::app_data_dir(&Default::default()).unwrap();
    let file_path = data_dir.join(file_name);
    let decoded = base64::decode(data).expect("Failed to decode base64 data");
    std::fs::write(file_path, decoded).unwrap();
}