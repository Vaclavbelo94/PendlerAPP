import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/components/theme-provider';
import { toast } from 'sonner';

export interface UserSettings {
  // Profile settings
  display_name: string;
  bio: string;
  location: string;
  website: string;
  phone_number: string;
  
  // Appearance settings
  theme: 'light' | 'dark' | 'system';
  color_scheme: string;
  font_size: 'small' | 'medium' | 'large';
  compact_mode: boolean;
  animations_enabled: boolean;
  high_contrast: boolean;
  
  // Notification settings
  email_notifications: boolean;
  push_notifications: boolean;
  shift_reminders: boolean;
  reminder_time: string;
  weekly_summaries: boolean;
  system_updates: boolean;
  
  // System settings
  auto_sync: boolean;
  offline_mode: boolean;
  language: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  display_name: '',
  bio: '',
  location: '',
  website: '',
  phone_number: '',
  theme: 'system',
  color_scheme: 'purple',
  font_size: 'medium',
  compact_mode: false,
  animations_enabled: true,
  high_contrast: false,
  email_notifications: true,
  push_notifications: true,
  shift_reminders: true,
  reminder_time: '08:00:00',
  weekly_summaries: false,
  system_updates: true,
  auto_sync: true,
  offline_mode: false,
  language: 'cs'
};

export const useUserSettings = () => {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from database
  const loadSettings = useCallback(async () => {
    if (!user) {
      setSettings(DEFAULT_SETTINGS);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        const userSettings: UserSettings = {
          display_name: data.display_name || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          phone_number: data.phone_number || '',
          theme: data.theme as 'light' | 'dark' | 'system',
          color_scheme: data.color_scheme,
          font_size: data.font_size as 'small' | 'medium' | 'large',
          compact_mode: data.compact_mode,
          animations_enabled: data.animations_enabled,
          high_contrast: data.high_contrast,
          email_notifications: data.email_notifications,
          push_notifications: data.push_notifications,
          shift_reminders: data.shift_reminders,
          reminder_time: data.reminder_time,
          weekly_summaries: data.weekly_summaries,
          system_updates: data.system_updates,
          auto_sync: data.auto_sync,
          offline_mode: data.offline_mode,
          language: data.language
        };
        setSettings(userSettings);
        
        // Apply theme setting
        setTheme(userSettings.theme);
      } else {
        // No existing settings found, use defaults
        setSettings(DEFAULT_SETTINGS);
        setTheme(DEFAULT_SETTINGS.theme);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      toast.error('Nepodařilo se načíst nastavení');
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setIsLoading(false);
    }
  }, [user, setTheme]);

  // Save settings to database
  const saveSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    if (!user) return false;

    setIsSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          display_name: updatedSettings.display_name,
          bio: updatedSettings.bio,
          location: updatedSettings.location,
          website: updatedSettings.website,
          phone_number: updatedSettings.phone_number,
          theme: updatedSettings.theme,
          color_scheme: updatedSettings.color_scheme,
          font_size: updatedSettings.font_size,
          compact_mode: updatedSettings.compact_mode,
          animations_enabled: updatedSettings.animations_enabled,
          high_contrast: updatedSettings.high_contrast,
          email_notifications: updatedSettings.email_notifications,
          push_notifications: updatedSettings.push_notifications,
          shift_reminders: updatedSettings.shift_reminders,
          reminder_time: updatedSettings.reminder_time,
          weekly_summaries: updatedSettings.weekly_summaries,
          system_updates: updatedSettings.system_updates,
          auto_sync: updatedSettings.auto_sync,
          offline_mode: updatedSettings.offline_mode,
          language: updatedSettings.language,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      setSettings(updatedSettings);
      
      // Apply theme changes immediately
      if (newSettings.theme) {
        setTheme(newSettings.theme);
      }
      
      toast.success('Nastavení uloženo');
      return true;
    } catch (error: any) {
      console.error('Error saving user settings:', error);
      
      // More specific error messages
      if (error.code === '23505') {
        toast.error('Konflikt při ukládání - zkuste to znovu');
      } else if (error.message?.includes('network')) {
        toast.error('Chyba sítě - zkontrolujte připojení');
      } else {
        toast.error('Nepodařilo se uložit nastavení');
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, settings, setTheme]);

  // Update specific setting
  const updateSetting = useCallback(<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    return saveSettings({ [key]: value });
  }, [saveSettings]);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Sync settings with i18n language change
  useEffect(() => {
    const currentLang = localStorage.getItem('app_language');
    if (currentLang && currentLang !== settings.language && !isLoading) {
      updateSetting('language', currentLang);
    }
  }, [settings.language, updateSetting, isLoading]);

  return {
    settings,
    isLoading,
    isSaving,
    saveSettings,
    updateSetting,
    loadSettings
  };
};