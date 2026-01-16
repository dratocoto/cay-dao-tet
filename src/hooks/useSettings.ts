import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface WindowSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnimationSettings {
  enabled: boolean;
  petal_count: number;
  wind_strength: number;
  speed: number;
}

export interface UISettings {
  opacity: number;
  always_on_top: boolean;
}

export interface Settings {
  window: WindowSettings;
  animation: AnimationSettings;
  ui: UISettings;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('Loading settings...');
      const loaded = await invoke<Settings>('get_settings');
      console.log('Settings loaded:', loaded);
      setSettings(loaded);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await invoke('save_settings', { settings: newSettings });
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  };

  return {
    settings,
    loading,
    saveSettings,
    reload: loadSettings,
  };
}
