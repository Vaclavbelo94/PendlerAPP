
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

interface AdvancedNotificationsState {
  settings: NotificationSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isInitialized: boolean;
  permissionGranted: boolean;
  behaviorPattern: string;
  requestPermission: () => Promise<boolean>;
  syncAcrossDevices: () => Promise<boolean>;
  analyzeUserBehavior: () => Promise<string>;
}

export const useAdvancedNotifications = () => {
  const { user } = useAuth();
  const [state, setState] = useState<AdvancedNotificationsState>({
    settings: null,
    isLoading: true,
    isSaving: false,
    error: null,
    isInitialized: false,
    permissionGranted: false,
    behaviorPattern: 'moderate',
    requestPermission: async () => false,
    syncAcrossDevices: async () => false,
    analyzeUserBehavior: async () => 'moderate'
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        // Use user_notification_preferences table instead of notification_settings
        const { data, error } = await supabase
          .from('user_notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        const settings: NotificationSettings = {
          emailNotifications: data?.email_notifications || false,
          pushNotifications: data?.push_notifications || false,
          smsNotifications: false // This field doesn't exist in the table
        };

        setState(prevState => ({
          ...prevState,
          settings,
          isLoading: false,
          isInitialized: true,
          permissionGranted: true,
          behaviorPattern: 'moderate'
        }));
      } catch (error: any) {
        console.error('Error loading notification settings:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message || 'Chyba při načítání nastavení notifikací',
          isLoading: false,
        }));
      }
    };

    loadSettings();
  }, [user]);

  const saveSettings = async (newSettings: NotificationSettings) => {
    if (!user) return false;

    setState(prevState => ({ ...prevState, isSaving: true, error: null }));

    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: newSettings.emailNotifications,
          push_notifications: newSettings.pushNotifications,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setState(prevState => ({
        ...prevState,
        settings: newSettings,
        isSaving: false,
      }));

      toast.success('Nastavení notifikací uloženo');
      return true;
    } catch (error: any) {
      console.error('Error saving notification settings:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při ukládání nastavení notifikací',
        isSaving: false,
      }));
      toast.error('Chyba při ukládání nastavení notifikací');
      return false;
    }
  };

  const requestPermission = async () => {
    return true; // Mock implementation
  };

  const syncAcrossDevices = async () => {
    return true; // Mock implementation
  };

  const analyzeUserBehavior = async () => {
    return 'moderate'; // Mock implementation
  };

  return {
    ...state,
    saveSettings,
    requestPermission,
    syncAcrossDevices,
    analyzeUserBehavior,
  };
};
