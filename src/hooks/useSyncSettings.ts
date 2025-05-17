
import { useState, useEffect } from 'react';

export type SyncSettings = {
  showSyncNotifications: boolean;
  enableBackgroundSync: boolean;
};

// Výchozí nastavení
const defaultSettings: SyncSettings = {
  showSyncNotifications: true,
  enableBackgroundSync: true
};

const SYNC_SETTINGS_KEY = 'syncSettings';

export const useSyncSettings = () => {
  const [settings, setSettings] = useState<SyncSettings>(() => {
    // Při prvním vykreslení načteme nastavení z localStorage nebo použijeme výchozí
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem(SYNC_SETTINGS_KEY);
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }
    return defaultSettings;
  });

  // Uložení nastavení při změně
  useEffect(() => {
    localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify(settings));
    
    // Aktualizace session storage pro okamžité uplatnění nastavení notifikací
    if (!settings.showSyncNotifications) {
      sessionStorage.setItem('syncNotificationShown', 'true');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SyncSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings
  };
};
