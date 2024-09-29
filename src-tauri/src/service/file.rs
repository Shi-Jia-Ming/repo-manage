use std::io::Read;
use std::path::PathBuf;
use tauri::command;

#[command]
pub fn get_file_list(file_path: &str) -> Vec<String> {
    let entries = std::fs::read_dir(file_path).unwrap();
    let mut file_list = Vec::new();
    for entry in entries {
        let entry = entry.unwrap();
        let path = entry.path();
        let file_name = path.file_name().unwrap().to_str().unwrap().to_string();
        if file_name.split('.').last().unwrap() == "pdf" {
            file_list.push(file_name);
        }
    }
    file_list
}

#[command]
pub fn init_file_path(file_path: &str) {
    let data_dir = PathBuf::from(file_path);
    if !data_dir.exists() {
        std::fs::create_dir_all(data_dir).unwrap();
    }
}


#[command]
pub fn load_file(file_path: &str) -> String {
    let file = std::fs::File::open(file_path).unwrap();
    let reader = std::io::BufReader::new(file);
    let data: Vec<u8> = reader.bytes().map(|b| b.unwrap()).collect();

    base64::encode(data)
}
