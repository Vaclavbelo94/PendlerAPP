
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
  
  const {
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
  } = useAppearanceSettings(initialDarkMode, initialColorScheme, initialCompactMode, onSave);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Načítání nastavení...</span>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
          <Eye className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
          <span>Nastavení vzhledu</span>
        </CardTitle>
        <CardDescription className={`${isMobile ? 'text-xs' : ''}`}>
          Upravte si základní nastavení zobrazení aplikace
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
      </CardContent>
      <CardFooter className={`${isMobile ? 'px-4' : ''}`}>
        <Button 
          onClick={handleSave} 
          className={`${isMobile ? 'w-full' : 'ml-auto'}`}
          disabled={isChangingTheme || isLoading}
          size={isMobile ? "sm" : "default"}
        >
          {isLoading ? "Ukládání..." : "Uložit nastavení"}
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
