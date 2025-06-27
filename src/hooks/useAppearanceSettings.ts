import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Colors } from '@/types/appearance';
import { useAuth } from '@/hooks/auth';

interface AppearanceSettingsState {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  isLoading: boolean;
  error: string | null;
}

const defaultColors: Colors = {
  light: {
    primary: '#0ea5e9',
    secondary: '#64748b',
    background: '#f9fafb',
    foreground: '#020617',
    card: '#ffffff',
    cardForeground: '#020617',
    muted: '#f3f4f6',
    mutedForeground: '#64748b',
    popover: '#ffffff',
    popoverForeground: '#020617',
    border: '#e5e7eb',
    input: '#e5e7eb',
    ring: '#0ea5e9',
  },
  dark: {
    primary: '#22d3ee',
    secondary: '#94a3b8',
    background: '#0f172a',
    foreground: '#cbd5e1',
    card: '#1e293b',
    cardForeground: '#cbd5e1',
    muted: '#334155',
    mutedForeground: '#94a3b8',
    popover: '#1e293b',
    popoverForeground: '#cbd5e1',
    border: '#475569',
    input: '#475569',
    ring: '#22d3ee',
  },
};

export const useAppearanceSettings = () => {
  const { user } = useAuth();
  const [state, setState] = useState<AppearanceSettingsState>({
    theme: 'system',
    primaryColor: defaultColors.light.primary,
    accentColor: defaultColors.light.primary,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      setState(prevState => ({ ...prevState, isLoading: true, error: null }));

      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('theme, primary_color, accent_color')
          .eq('user_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setState(prevState => ({
          ...prevState,
          theme: data?.theme || 'system',
          primaryColor: data?.primary_color || defaultColors.light.primary,
          accentColor: data?.accent_color || defaultColors.light.primary,
          isLoading: false,
        }));
      } catch (error: any) {
        console.error('Error loading appearance settings:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message || 'Chyba při načítání nastavení vzhledu',
          isLoading: false,
        }));
      }
    };

    loadSettings();
  }, [user]);

  const saveSettings = async (newTheme: string, newPrimaryColor: string, newAccentColor: string) => {
    if (!user) return false;

    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          theme: newTheme,
          primary_color: newPrimaryColor,
          accent_color: newAccentColor,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) {
        throw error;
      }

      setState(prevState => ({
        ...prevState,
        theme: newTheme as 'light' | 'dark' | 'system',
        primaryColor: newPrimaryColor,
        accentColor: newAccentColor,
        isLoading: false,
      }));

      toast.success('Nastavení vzhledu uloženo!');
      return true;
    } catch (error: any) {
      console.error('Error saving appearance settings:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při ukládání nastavení vzhledu',
        isLoading: false,
      }));
      toast.error('Chyba při ukládání nastavení vzhledu.');
      return false;
    }
  };

  return {
    ...state,
    saveSettings,
  };
};
