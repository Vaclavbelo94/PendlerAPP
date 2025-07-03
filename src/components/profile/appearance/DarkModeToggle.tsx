
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from 'react-i18next';

interface DarkModeToggleProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isChangingTheme: boolean;
}

const DarkModeToggle = ({ darkMode, setDarkMode, isChangingTheme }: DarkModeToggleProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('settings');

  return (
    <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
      <div className={`${isMobile ? 'text-center' : ''}`}>
        <Label htmlFor="darkMode" className={`${isMobile ? 'text-sm' : 'text-base'} flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
          {darkMode ? (
            <Moon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          ) : (
            <Sun className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          )}
          <span>{t('darkMode')}</span>
        </Label>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground ${isMobile ? 'text-center mt-1' : ''}`}>
          {t('darkModeDescription')}
        </p>
      </div>
      <Switch 
        id="darkMode" 
        checked={darkMode}
        onCheckedChange={setDarkMode}
        disabled={isChangingTheme}
      />
    </div>
  );
};

export default DarkModeToggle;
