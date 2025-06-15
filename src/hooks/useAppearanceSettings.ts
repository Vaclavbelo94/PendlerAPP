
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
  
  // Add initialization state to prevent cycles
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasLoadedFromDB, setHasLoadedFromDB] = useState(false);
  
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [compactMode, setCompactMode] = useState(initialCompactMode);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('AppearanceSettings: State change', { 
      user: !!user, 
      isLoading, 
      isInitializing,
      hasLoadedFromDB,
      darkMode, 
      colorScheme, 
      compactMode,
      error 
    });
  }, [user, isLoading, isInitializing, hasLoadedFromDB, darkMode, colorScheme, compactMode, error]);

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
      setIsInitializing(false);
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
        
        // Set all states at once to prevent multiple re-renders
        setDarkMode(data.dark_mode);
        setCompactMode(data.compact_mode);
        
        // Apply theme settings from database
        const newTheme = data.dark_mode ? 'dark' : 'light';
        if (setTheme && theme !== newTheme) {
          setTheme(newTheme);
        }
        
        if (setColorScheme && colorScheme !== data.color_scheme) {
          setColorScheme(data.color_scheme as any);
        }
        
        setHasLoadedFromDB(true);
      } else {
        console.log('AppearanceSettings: No settings found, using defaults');
        setHasLoadedFromDB(true);
      }
    } catch (error) {
      console.error('AppearanceSettings: Error loading settings:', error);
      setError("Nepodařilo se načíst nastavení vzhledu");
      toast.error("Nepodařilo se načíst nastavení vzhledu");
    } finally {
      setIsLoading(false);
      // Small delay to ensure smooth initialization
      setTimeout(() => {
        setIsInitializing(false);
      }, 100);
    }
  }, [user, setColorScheme, setTheme, theme, colorScheme]);

  useEffect(() => {
    loadAppearanceSettings();
  }, [loadAppearanceSettings]);
  
  // Handle manual dark mode changes (from user interactions)
  const handleDarkModeChange = useCallback((newDarkMode: boolean) => {
    if (isInitializing || isChangingTheme) return;
    
    console.log('AppearanceSettings: Manual dark mode change', { newDarkMode });
    setDarkMode(newDarkMode);
    
    if (setTheme) {
      const newTheme = newDarkMode ? 'dark' : 'light';
      setTheme(newTheme);
    }
  }, [isInitializing, isChangingTheme, setTheme]);
  
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
    if (isInitializing) return;
    
    console.log('AppearanceSettings: Color scheme changing to', value);
    if (setColorScheme) {
      setColorScheme(value as any);
    }
  }, [setColorScheme, isInitializing]);

  return {
    darkMode,
    setDarkMode: handleDarkModeChange,
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
