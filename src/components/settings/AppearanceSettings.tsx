
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAppearanceSettings } from "@/hooks/useAppearanceSettings";
import { Palette, Moon, Sun, Sparkles, Monitor } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from '@/hooks/useLanguage';

const AppearanceSettings = () => {
  const { t } = useLanguage();
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
  } = useAppearanceSettings();

  const colorSchemes = [
    { value: 'purple', label: t('purple') || 'Fialová', color: 'bg-purple-500' },
    { value: 'blue', label: t('blue') || 'Modrá', color: 'bg-blue-500' },
    { value: 'green', label: t('green') || 'Zelená', color: 'bg-green-500' },
    { value: 'amber', label: t('yellow') || 'Žlutá', color: 'bg-amber-500' },
    { value: 'red', label: t('red') || 'Červená', color: 'bg-red-500' },
    { value: 'pink', label: t('pink') || 'Růžová', color: 'bg-pink-500' }
  ];

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
  };

  const handleCompactModeToggle = (checked: boolean) => {
    setCompactMode(checked);
  };

  const handleSaveClick = async () => {
    await handleSave();
  };

  if (error) {
    toast.error(error);
  }

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('appTheme') || 'Téma aplikace'}
          </CardTitle>
          <CardDescription>
            {t('customizeAppAppearance') || 'Přizpůsobte si vzhled aplikace podle vašich preferencí'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium flex items-center gap-2">
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {t('darkMode') || 'Tmavý režim'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('switchBetweenLightDarkTheme') || 'Přepnout mezi světlým a tmavým tématem'}
              </p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
              disabled={isChangingTheme}
            />
          </div>

          <Separator />

          {/* Color Scheme Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {t('colorScheme') || 'Barevné schéma'}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t('selectMainAppColor') || 'Vyberte hlavní barvu aplikace'}
            </p>
            <Select value={colorScheme} onValueChange={handleColorSchemeChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectColorScheme') || 'Vyberte barevné schéma'}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${
                      colorSchemes.find(c => c.value === colorScheme)?.color || 'bg-purple-500'
                    }`} />
                    {colorSchemes.find(c => c.value === colorScheme)?.label || t('purple') || 'Fialová'}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {colorSchemes.map((scheme) => (
                  <SelectItem key={scheme.value} value={scheme.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${scheme.color}`} />
                      {scheme.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                {t('compactMode') || 'Kompaktní režim'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('reduceSpacingForMoreContent') || 'Zmenší mezery a velikosti prvků pro více obsahu'}
              </p>
            </div>
            <Switch
              checked={compactMode}
              onCheckedChange={handleCompactModeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('preview') || 'Náhled'}</CardTitle>
          <CardDescription>
            {t('previewOfYourThemeSettings') || 'Ukázka vašeho nastaveného tématu'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg border bg-card ${compactMode ? 'space-y-2' : 'space-y-4'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${compactMode ? 'text-sm' : 'text-base'}`}>
                {t('sampleTitle') || 'Ukázkový nadpis'}
              </h3>
              <div className={`w-3 h-3 rounded-full bg-current opacity-20`} />
            </div>
            <p className={`text-muted-foreground ${compactMode ? 'text-xs' : 'text-sm'}`}>
              {t('sampleTextWithCurrentTheme') || 'Toto je ukázka textu s vaším aktuálním nastavením tématu.'}
            </p>
            <div className="flex gap-2">
              <div className={`px-2 py-1 bg-primary/10 rounded text-primary ${compactMode ? 'text-xs' : 'text-sm'}`}>
                {t('primary') || 'Primární'}
              </div>
              <div className={`px-2 py-1 bg-muted rounded ${compactMode ? 'text-xs' : 'text-sm'}`}>
                {t('secondary') || 'Sekundární'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveClick} disabled={isLoading}>
          {isLoading ? (t('saving') || 'Ukládám...') : (t('saveSettings') || 'Uložit nastavení')}
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettings;
