use std::env;
use std::path::PathBuf;
use tauri::command;

#[command]
pub fn init_configuration(config_dir_path: &str) {
    let config_file_name: &str = "config.toml";
    let config_file_path = PathBuf::from(config_dir_path).join(config_file_name);
    if !config_file_path.exists() {
        let default_config = format!(
            "[service]
translate_name = \"{}\"
translate_url = \"{}\"
translate_token = \"{}\"
",
            env::var("DEFAULT_NAME").unwrap(),
            env::var("DEFAULT_URL").unwrap(),
            env::var("DEFAULT_TOKEN").unwrap()
        );
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

#[command]
pub fn write_configuration(
    config_dir_path: &str,
    translate_name: &str,
    translate_url: &str,
    translate_token: &str,
) {
    let config_file_name: &str = "config.toml";
    let config_file_path = PathBuf::from(config_dir_path).join(config_file_name);
    let config = format!(
        "[service]
translate_name = \"{}\"
translate_url = \"{}\"
translate_token = \"{}\"
",
        translate_name, translate_url, translate_token
    );
    std::fs::write(config_file_path, config).unwrap();
}
