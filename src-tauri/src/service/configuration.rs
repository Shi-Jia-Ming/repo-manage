use std::path::PathBuf;
use tauri::command;

#[command]
pub fn init_configuration(config_dir_path: &str) {
    let config_file_name: &str = "config.toml";
    let config_file_path = PathBuf::from(config_dir_path).join(config_file_name);
    if !config_file_path.exists() {
        let default_config = r#"
[service]
translate_url = "http://118.26.36.198:31188"
translate_token = "GIC7xLUKsmBLiwgE"
"#;
        std::fs::write(config_file_path, default_config).unwrap();
    }
}

#[command]
pub fn get_configuration(config_dir_path: &str) -> toml::Value {
    let config_file_name: &str = "config.toml";
    let config_file_path = PathBuf::from(config_dir_path).join(config_file_name);
    if !config_file_path.exists() {
        init_configuration(config_dir_path);
    }
    let config_str = std::fs::read_to_string(config_file_path).unwrap();
    toml::from_str(&config_str).unwrap()
}