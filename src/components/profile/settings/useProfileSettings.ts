
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface ProfileSettings {
  username: string;
  fullName: string;
  bio: string;
  location: string;
  website: string;
}

interface ProfileSettingsState {
  settings: ProfileSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

export const useProfileSettings = () => {
  const { user } = useAuth();
  const [state, setState] = useState<ProfileSettingsState>({
    settings: null,
    isLoading: true,
    isSaving: false,
    error: null,
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, email, phone_number, bio, location, website')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setState(prevState => ({
          ...prevState,
          settings: {
            username: data?.username || '',
            fullName: data?.username || '',
            bio: data?.bio || '',
            location: data?.location || '',
            website: data?.website || '',
          },
          isLoading: false,
        }));
      } catch (error: any) {
        console.error('Error loading profile settings:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message || 'Chyba při načítání nastavení profilu',
          isLoading: false,
        }));
      }
    };

    loadSettings();
  }, [user]);

  const saveSettings = async (newSettings: ProfileSettings) => {
    if (!user) return false;

    setState(prevState => ({ ...prevState, isSaving: true, error: null }));

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: newSettings.username,
          bio: newSettings.bio,
          location: newSettings.location,
          website: newSettings.website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setState(prevState => ({
        ...prevState,
        settings: newSettings,
        isSaving: false,
      }));

      return true;
    } catch (error: any) {
      console.error('Error saving profile settings:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při ukládání nastavení profilu',
        isSaving: false,
      }));
      return false;
    }
  };

  return {
    ...state,
    saveSettings,
  };
};
