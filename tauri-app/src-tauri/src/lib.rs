// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

//0 = tie, 1 = win, -1 = loss
//0 = rock, 1 = paper, 2 = scissors
#[tauri::command]
fn play_game(weapon: i32, computer_weapon: i32) -> i32 {
    if weapon == computer_weapon {
        return 0;
    } else if weapon == 0 {
        if computer_weapon == 1 {
            return -1;
        } else if computer_weapon == 2 {
            return 1;
        }   
    } else if weapon == 1 {
        if computer_weapon == 0 {
            return 1;
        } else if computer_weapon == 2 {
            return -1;
        }
    } else if weapon == 2 {
        if computer_weapon == 0 {
            return -1;
        } else if computer_weapon == 1 {
            return 1;
        }
    }
    return 2;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, play_game])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
