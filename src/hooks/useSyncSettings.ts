
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SyncSettings {
  enableBackgroundSync: boolean;
  showSyncNotifications: boolean;
  syncInterval: number; // milliseconds
  lastSyncTime: Date | null;
}

const DEFAULT_SETTINGS: SyncSettings = {
  enableBackgroundSync: true,
  showSyncNotifications: true,
  syncInterval: 300000, // 5 minutes
  lastSyncTime: null
};

export const useSyncSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SyncSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from Supabase
  const loadSettings = useCallback(async () => {
    if (!user) {
      setSettings(DEFAULT_SETTINGS);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_sync_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          enableBackgroundSync: data.enable_background_sync,
          showSyncNotifications: data.show_sync_notifications,
          syncInterval: data.sync_interval,
          lastSyncTime: data.last_sync_time ? new Date(data.last_sync_time) : null
        });
      } else {
        // Create default settings for new user
        await saveSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error loading sync settings:', error);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save settings to Supabase
  const saveSettings = useCallback(async (newSettings: Partial<SyncSettings>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };

      const { error } = await supabase
        .from('user_sync_settings')
        .upsert({
          user_id: user.id,
          enable_background_sync: updatedSettings.enableBackgroundSync,
          show_sync_notifications: updatedSettings.showSyncNotifications,
          sync_interval: updatedSettings.syncInterval,
          last_sync_time: updatedSettings.lastSyncTime?.toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(updatedSettings);
      return true;
    } catch (error) {
      console.error('Error saving sync settings:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, settings]);

  // Update last sync time
  const updateLastSyncTime = useCallback(async () => {
    const now = new Date();
    await saveSettings({ lastSyncTime: now });
  }, [saveSettings]);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    isSaving,
    saveSettings,
    updateLastSyncTime,
    loadSettings
  };
};
