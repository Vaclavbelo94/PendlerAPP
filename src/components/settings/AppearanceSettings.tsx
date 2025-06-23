
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Palette, Monitor, Sun, Moon, Eye } from 'lucide-react';
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('settings');
  const [fontSize, setFontSize] = useState("medium");
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Load appearance settings from localStorage
    const savedSettings = localStorage.getItem('appearanceSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setFontSize(parsed.fontSize || "medium");
        setCompactMode(parsed.compactMode || false);
        setAnimations(parsed.animations ?? true);
        setHighContrast(parsed.highContrast || false);
      } catch (error) {
        console.error('Error loading appearance settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = {
      fontSize,
      compactMode,
      animations,
      highContrast
    };
    
    localStorage.setItem('appearanceSettings', JSON.stringify(settings));
    toast.success(t('appearanceSettingsSaved'));
  };

  const handleReset = () => {
    setFontSize("medium");
    setCompactMode(false);
    setAnimations(true);
    setHighContrast(false);
    localStorage.removeItem('appearanceSettings');
    toast.success(t('appearanceSettingsReset'));
  };

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('theme')}
          </CardTitle>
          <CardDescription>
            {t('chooseThemePreference')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="h-20 flex-col gap-2"
            >
              <Sun className="h-6 w-6" />
              {t('light')}
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="h-20 flex-col gap-2"
            >
              <Moon className="h-6 w-6" />
              {t('dark')}
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className="h-20 flex-col gap-2"
            >
              <Monitor className="h-6 w-6" />
              {t('system')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {t('display')}
          </CardTitle>
          <CardDescription>
            {t('customizeDisplaySettings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fontSize">{t('fontSize')}</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger id="fontSize">
                <SelectValue placeholder={t('selectFontSize')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{t('small')}</SelectItem>
                <SelectItem value="medium">{t('medium')}</SelectItem>
                <SelectItem value="large">{t('large')}</SelectItem>
                <SelectItem value="xl">{t('extraLarge')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compactMode">{t('compactMode')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('reducePaddingSpacing')}
              </p>
            </div>
            <Switch
              id="compactMode"
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="animations">{t('animations')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('enableAnimationsTransitions')}
              </p>
            </div>
            <Switch
              id="animations"
              checked={animations}
              onCheckedChange={setAnimations}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="highContrast">{t('highContrast')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('increaseColorContrast')}
              </p>
            </div>
            <Switch
              id="highContrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="gap-2">
          {t('saveChanges')}
        </Button>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          {t('resetToDefaults')}
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettings;
