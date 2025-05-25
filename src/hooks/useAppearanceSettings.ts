
import { useState, useEffect } from "react";
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
  const { theme, setTheme, colorScheme, setColorScheme, isChangingTheme } = useTheme();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [compactMode, setCompactMode] = useState(initialCompactMode);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from database when component mounts
  useEffect(() => {
    const loadAppearanceSettings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_appearance_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Chyba při načítání nastavení vzhledu:', error);
          throw error;
        }

        if (data) {
          setDarkMode(data.dark_mode);
          setColorScheme(data.color_scheme as any);
          setCompactMode(data.compact_mode);
        }
      } catch (error) {
        console.error('Chyba při načítání nastavení vzhledu:', error);
        toast.error("Nepodařilo se načíst nastavení vzhledu");
      } finally {
        setIsLoading(false);
      }
    };

    loadAppearanceSettings();
  }, [user, setColorScheme]);
  
  // Sync dark mode state with global theme
  useEffect(() => {
    if (!isChangingTheme) {
      setDarkMode(theme === 'dark');
    }
  }, [theme, isChangingTheme]);
  
  // Set global theme when darkMode toggle changes
  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light');
  }, [darkMode, setTheme]);
  
  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
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

      toast.success("Nastavení vzhledu bylo uloženo");
      
      if (onSave) {
        onSave({ 
          darkMode, 
          colorScheme,
          compactMode 
        });
      }
    } catch (error) {
      console.error('Chyba při ukládání nastavení vzhledu:', error);
      toast.error("Nepodařilo se uložit nastavení vzhledu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value as any);
  };

  return {
    darkMode,
    setDarkMode,
    colorScheme,
    handleColorSchemeChange,
    compactMode,
    setCompactMode,
    isLoading,
    isChangingTheme,
    handleSave
  };
};
