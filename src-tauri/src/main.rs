// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use crate::service::configuration::{get_configuration, init_configuration};
use crate::service::file::{get_file_list, init_file_path, load_file};
use crate::utils::set_window_shadows;

mod service;
mod utils;

fn main() {
    // load env variables
    dotenv().ok();

    let apps_dir = tauri::api::path::app_data_dir(&Default::default()).expect("failed to get app data dir");
    let app_dir = apps_dir.join("cn.edu.hit.pdf-translator");
    if !app_dir.exists() {
        std::fs::create_dir_all(&app_dir).expect("failed to create app dir");
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            load_file,
            get_file_list,
            init_file_path,
            init_configuration,
            get_configuration
        ])
        .setup(|app| {
            set_window_shadows(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
