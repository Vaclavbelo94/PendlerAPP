
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppearanceSettings } from "@/hooks/useAppearanceSettings";
import ProfileErrorBoundary from "./ProfileErrorBoundary";
import DarkModeToggle from "./appearance/DarkModeToggle";
import ColorSchemeSelector from "./appearance/ColorSchemeSelector";
import CompactModeToggle from "./appearance/CompactModeToggle";
import { useTranslation } from 'react-i18next';

interface ProfileAppearanceProps {
  initialDarkMode?: boolean;
  initialColorScheme?: string;
  initialCompactMode?: boolean;
  onSave?: (settings: {
    darkMode: boolean;
    colorScheme: string;
    compactMode: boolean;
  }) => void;
}

const ProfileAppearanceContent = ({
  initialDarkMode = false,
  initialColorScheme = "purple",
  initialCompactMode = false,
  onSave
}: ProfileAppearanceProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('profile');
  
  const {
    theme,
    primaryColor,
    accentColor,
    isLoading,
    error,
    saveSettings
  } = useAppearanceSettings();

  // Map theme to darkMode for compatibility
  const darkMode = theme === 'dark';
  const setDarkMode = (isDark: boolean) => {
    saveSettings(isDark ? 'dark' : 'light', primaryColor, accentColor);
  };

  // Use primaryColor as colorScheme for compatibility
  const colorScheme = primaryColor;
  const handleColorSchemeChange = (newColorScheme: string) => {
    saveSettings(theme, newColorScheme, accentColor);
  };

  // Mock compact mode for now
  const compactMode = false;
  const setCompactMode = (isCompact: boolean) => {
    console.log('Compact mode:', isCompact);
  };

  const isChangingTheme = isLoading;

  const handleSave = async () => {
    if (onSave) {
      onSave({
        darkMode,
        colorScheme,
        compactMode,
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">{t('loadingSettings')}</span>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className={`${isMobile ? 'pb-3 text-center' : ''}`}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base justify-center' : ''}`}>
          <Eye className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          <span>{t('appearanceSettings')}</span>
        </CardTitle>
        <CardDescription className={`${isMobile ? 'text-xs text-center' : ''}`}>
          {t('adjustDisplaySettings')}
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'px-4' : ''}`}>
        {error && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-6">
          <DarkModeToggle 
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            isChangingTheme={isChangingTheme}
          />
          
          <Separator className="my-4" />
          
          <ColorSchemeSelector 
            colorScheme={colorScheme}
            onColorSchemeChange={handleColorSchemeChange}
          />
          
          <Separator className="my-4" />
          
          <CompactModeToggle 
            compactMode={compactMode}
            setCompactMode={setCompactMode}
          />
        </div>
        
        {isMobile && (
          <div className="mt-6 p-3 bg-muted/20 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              ℹ️ {t('changesAppliedImmediately')}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className={`${isMobile ? 'px-4 justify-center' : ''}`}>
        <Button 
          onClick={handleSave} 
          className={`${isMobile ? 'w-full' : 'ml-auto'}`}
          disabled={isChangingTheme || isLoading}
          size={isMobile ? "sm" : "default"}
          variant="outline"
        >
          {isLoading ? t('savingSettings') : t('saveToProfile')}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProfileAppearance = (props: ProfileAppearanceProps) => {
  return (
    <ProfileErrorBoundary>
      <ProfileAppearanceContent {...props} />
    </ProfileErrorBoundary>
  );
};

export default ProfileAppearance;
