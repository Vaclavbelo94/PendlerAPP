
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const [settings, setSettings] = useState<SyncSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        // Fallback to localStorage if not authenticated
        const savedSettings = localStorage.getItem('syncSettings');
        if (savedSettings) {
          try {
            const parsed = JSON.parse(savedSettings);
            setSettings({ ...defaultSettings, ...parsed });
          } catch (error) {
            console.error('Error loading sync settings from localStorage:', error);
          }
        }
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_sync_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading sync settings:', error);
          throw error;
        }

        if (data) {
          setSettings({
            enableBackgroundSync: data.enable_background_sync,
            showSyncNotifications: data.show_sync_notifications,
            syncInterval: data.sync_interval,
            lastSyncTime: data.last_sync_time,
          });
        } else {
          // Create default settings for new user
          const { error: insertError } = await supabase
            .from('user_sync_settings')
            .insert({
              user_id: user.id,
              enable_background_sync: defaultSettings.enableBackgroundSync,
              show_sync_notifications: defaultSettings.showSyncNotifications,
              sync_interval: defaultSettings.syncInterval,
            });

          if (insertError) {
            console.error('Error creating default sync settings:', insertError);
          }
        }
      } catch (error) {
        console.error('Error loading sync settings:', error);
        // Fallback to localStorage
        const savedSettings = localStorage.getItem('syncSettings');
        if (savedSettings) {
          try {
            const parsed = JSON.parse(savedSettings);
            setSettings({ ...defaultSettings, ...parsed });
          } catch (parseError) {
            console.error('Error parsing localStorage settings:', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const updateSettings = async (newSettings: Partial<SyncSettings>) => {
    setLoading(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      if (user) {
        // Save to database
        const { error } = await supabase
          .from('user_sync_settings')
          .update({
            enable_background_sync: updatedSettings.enableBackgroundSync,
            show_sync_notifications: updatedSettings.showSyncNotifications,
            sync_interval: updatedSettings.syncInterval,
            last_sync_time: updatedSettings.lastSyncTime,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating sync settings:', error);
          throw error;
        }
      } else {
        // Fallback to localStorage if not authenticated
        localStorage.setItem('syncSettings', JSON.stringify(updatedSettings));
      }
      
      if (newSettings.showSyncNotifications !== undefined) {
        toast.success('Nastavení synchronizace bylo uloženo');
      }
    } catch (error) {
      console.error('Error updating sync settings:', error);
      toast.error('Chyba při ukládání nastavení');
      
      // Revert settings on error
      setSettings(settings);
    } finally {
      setLoading(false);
    }
  };

  const updateLastSyncTime = async () => {
    if (!user) return;
    
    try {
      const currentTime = new Date().toISOString();
      await supabase
        .from('user_sync_settings')
        .update({
          last_sync_time: currentTime,
          updated_at: currentTime,
        })
        .eq('user_id', user.id);
      
      setSettings(prev => ({ ...prev, lastSyncTime: currentTime }));
    } catch (error) {
      console.error('Error updating last sync time:', error);
    }
  };

  return {
    settings,
    updateSettings,
    updateLastSyncTime,
    loading,
  };
};
