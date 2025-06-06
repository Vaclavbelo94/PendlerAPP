
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useAppearanceSettings = (
  initialDarkMode = false,
  initialColorScheme = "purple",
  initialCompactMode = false,
  onSave?: (settings: {
    darkMode: boolean;
    colorScheme: string;
    compactMode: boolean;
  }) => void
) => {
  // Safely access theme context with fallback
  let themeContext;
  try {
    themeContext = useTheme();
  } catch (error) {
    console.warn('ThemeProvider not available, using fallback values');
    themeContext = {
      theme: 'light',
      setTheme: () => {},
      colorScheme: 'purple',
      setColorScheme: () => {},
      isChangingTheme: false
    };
  }

  const { theme, setTheme, colorScheme, setColorScheme, isChangingTheme } = themeContext;
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [compactMode, setCompactMode] = useState(initialCompactMode);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('AppearanceSettings: State change', { 
      user: !!user, 
      isLoading, 
      darkMode, 
      colorScheme, 
      compactMode,
      error 
    });
  }, [user, isLoading, darkMode, colorScheme, compactMode, error]);

  // Memoized settings object
  const currentSettings = useMemo(() => ({
    darkMode,
    colorScheme,
    compactMode
  }), [darkMode, colorScheme, compactMode]);

  // Load settings from database when component mounts
  const loadAppearanceSettings = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    console.log('AppearanceSettings: Loading settings for user', user.id);
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: dbError } = await supabase
        .from('user_appearance_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (dbError && dbError.code !== 'PGRST116') {
        console.error('AppearanceSettings: Database error:', dbError);
        throw dbError;
      }

      if (data) {
        console.log('AppearanceSettings: Loaded settings', data);
        setDarkMode(data.dark_mode);
        if (setColorScheme) {
          setColorScheme(data.color_scheme as any);
        }
        setCompactMode(data.compact_mode);
      } else {
        console.log('AppearanceSettings: No settings found, using defaults');
      }
    } catch (error) {
      console.error('AppearanceSettings: Error loading settings:', error);
      setError("Nepodařilo se načíst nastavení vzhledu");
      toast.error("Nepodařilo se načíst nastavení vzhledu");
    } finally {
      setIsLoading(false);
    }
  }, [user, setColorScheme]);

  useEffect(() => {
    loadAppearanceSettings();
  }, [loadAppearanceSettings]);
  
  // Sync dark mode state with global theme
  useEffect(() => {
    if (!isChangingTheme && theme) {
      const newDarkMode = theme === 'dark';
      if (newDarkMode !== darkMode) {
        console.log('AppearanceSettings: Syncing darkMode with theme', { theme, newDarkMode });
        setDarkMode(newDarkMode);
      }
    }
  }, [theme, isChangingTheme, darkMode]);
  
  // Set global theme when darkMode toggle changes
  useEffect(() => {
    if (setTheme) {
      const newTheme = darkMode ? 'dark' : 'light';
      if (theme !== newTheme) {
        console.log('AppearanceSettings: Setting theme', { darkMode, newTheme });
        setTheme(newTheme);
      }
    }
  }, [darkMode, theme, setTheme]);
  
  const handleSave = useCallback(async () => {
    if (!user) {
      console.warn('AppearanceSettings: No user for save operation');
      return;
    }
    
    console.log('AppearanceSettings: Saving settings', currentSettings);
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if settings already exist
      const { data: existingSettings, error: checkError } = await supabase
        .from('user_appearance_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      const settingsData = {
        user_id: user.id,
        dark_mode: darkMode,
        color_scheme: colorScheme,
        compact_mode: compactMode,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingSettings) {
        // Update existing settings
        result = await supabase
          .from('user_appearance_settings')
          .update(settingsData)
          .eq('user_id', user.id);
      } else {
        // Create new settings
        result = await supabase
          .from('user_appearance_settings')
          .insert(settingsData);
      }

      if (result.error) {
        throw result.error;
      }

      console.log('AppearanceSettings: Settings saved successfully');
      toast.success("Nastavení vzhledu bylo uloženo");
      
      if (onSave) {
        onSave(currentSettings);
      }
    } catch (error) {
      console.error('AppearanceSettings: Error saving settings:', error);
      setError("Nepodařilo se uložit nastavení vzhledu");
      toast.error("Nepodařilo se uložit nastavení vzhledu");
    } finally {
      setIsLoading(false);
    }
  }, [user, currentSettings, darkMode, colorScheme, compactMode, onSave]);

  const handleColorSchemeChange = useCallback((value: string) => {
    console.log('AppearanceSettings: Color scheme changing to', value);
    if (setColorScheme) {
      setColorScheme(value as any);
    }
  }, [setColorScheme]);

  return {
    darkMode,
    setDarkMode,
    colorScheme,
    handleColorSchemeChange,
    compactMode,
    setCompactMode,
    isLoading,
    isChangingTheme,
    error,
    handleSave
  };
};
