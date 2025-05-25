
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface SyncSettings {
  enableBackgroundSync: boolean;
  showSyncNotifications: boolean;
  syncInterval: number;
  lastSyncTime?: string;
}

const defaultSettings: SyncSettings = {
  enableBackgroundSync: true,
  showSyncNotifications: true,
  syncInterval: 300000, // 5 minutes
};

export const useSyncSettings = () => {
  const [settings, setSettings] = useState<SyncSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('syncSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading sync settings:', error);
      }
    }
  }, []);

  const updateSettings = async (newSettings: Partial<SyncSettings>) => {
    setLoading(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      // Save to localStorage
      localStorage.setItem('syncSettings', JSON.stringify(updatedSettings));
      
      if (newSettings.showSyncNotifications !== undefined) {
        toast.success('Nastavení synchronizace bylo uloženo');
      }
    } catch (error) {
      console.error('Error updating sync settings:', error);
      toast.error('Chyba při ukládání nastavení');
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    updateSettings,
    loading,
  };
};
