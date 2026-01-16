use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Settings {
    pub window: WindowSettings,
    pub animation: AnimationSettings,
    pub ui: UISettings,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WindowSettings {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AnimationSettings {
    pub enabled: bool,
    pub petal_count: i32,
    pub wind_strength: f64,
    pub speed: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UISettings {
    pub opacity: f64,
    pub always_on_top: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Settings {
            window: WindowSettings {
                x: 100,
                y: 100,
                width: 338,
                height: 423,
            },
            animation: AnimationSettings {
                enabled: true,
                petal_count: 65,
                wind_strength: 0.5,
                speed: 1.0,
            },
            ui: UISettings {
                opacity: 1.0,
                always_on_top: true,
            },
        }
    }
}

fn get_settings_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data = app.path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    std::fs::create_dir_all(&app_data)
        .map_err(|e| format!("Failed to create app data directory: {}", e))?;
    
    Ok(app_data.join("settings.json"))
}

#[tauri::command]
pub fn get_settings(app: AppHandle) -> Result<Settings, String> {
    let settings_path = get_settings_path(&app)?;
    
    if settings_path.exists() {
        let content = fs::read_to_string(&settings_path)
            .map_err(|e| format!("Failed to read settings: {}", e))?;
        let settings: Settings = serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse settings: {}", e))?;
        Ok(settings)
    } else {
        let default_settings = Settings::default();
        save_settings_internal(&app, &default_settings)?;
        Ok(default_settings)
    }
}

#[tauri::command]
pub fn save_settings(app: AppHandle, settings: Settings) -> Result<(), String> {
    save_settings_internal(&app, &settings)
}

fn save_settings_internal(app: &AppHandle, settings: &Settings) -> Result<(), String> {
    let settings_path = get_settings_path(app)?;
    let content = serde_json::to_string_pretty(settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;
    fs::write(&settings_path, content)
        .map_err(|e| format!("Failed to write settings: {}", e))?;
    Ok(())
}
