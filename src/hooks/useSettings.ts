import { useState, useEffect, useCallback } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';

const STORAGE_KEY = 'purge-settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Try to load from Electron store first
    if (window.electronAPI?.getSettings) {
      try {
        const stored = window.electronAPI.getSettings();
        return { ...DEFAULT_SETTINGS, ...stored };
      } catch (error) {
        console.error('Failed to load settings from Electron:', error);
      }
    }

    // Fall back to localStorage
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }

    return DEFAULT_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist settings whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        // Save to Electron store if available
        if (window.electronAPI?.saveSettings) {
          await window.electronAPI.saveSettings(settings);
        }

        // Also save to localStorage as backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (err) {
        console.error('Failed to save settings:', err);
        setError('Failed to save settings');
      }
    };

    saveSettings();
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `purge-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [settings]);

  const importSettings = useCallback((settingsJson: string) => {
    try {
      const imported = JSON.parse(settingsJson);
      setSettings({ ...DEFAULT_SETTINGS, ...imported });
      return true;
    } catch (err) {
      setError('Failed to import settings: Invalid JSON');
      return false;
    }
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    isLoading,
    error,
  };
}
