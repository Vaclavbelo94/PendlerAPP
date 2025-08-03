import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Palette, Monitor, Sun, Moon, Smartphone, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

const ModernAppearanceSettings = () => {
  const { t } = useTranslation('settings');
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState('medium');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [colorScheme, setColorScheme] = useState('blue');

  useEffect(() => {
    const savedSettings = localStorage.getItem('appearanceSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setFontSize(parsed.fontSize ?? 'medium');
        setCompactMode(parsed.compactMode ?? false);
        setAnimations(parsed.animations ?? true);
        setHighContrast(parsed.highContrast ?? false);
        setColorScheme(parsed.colorScheme ?? 'blue');
      } catch (error) {
        console.error('Error loading appearance settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = {
      theme,
      fontSize,
      compactMode,
      animations,
      highContrast,
      colorScheme
    };
    
    localStorage.setItem('appearanceSettings', JSON.stringify(settings));
    toast.success(t('settingsSaved'));
  };

  const handleReset = () => {
    setTheme('system');
    setFontSize('medium');
    setCompactMode(false);
    setAnimations(true);
    setHighContrast(false);
    setColorScheme('blue');
    localStorage.removeItem('appearanceSettings');
    toast.success(t('settingsReset'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('appearance')}
          </CardTitle>
          <CardDescription>
            Přizpůsobte si vzhled aplikace podle svých preferencí
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Téma</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Světlé
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Tmavé
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                Auto
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Barevné schéma</Label>
            <Select value={colorScheme} onValueChange={setColorScheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Modrá</SelectItem>
                <SelectItem value="green">Zelená</SelectItem>
                <SelectItem value="purple">Fialová</SelectItem>
                <SelectItem value="orange">Oranžová</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Velikost písma</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Malé</SelectItem>
                <SelectItem value="medium">Střední</SelectItem>
                <SelectItem value="large">Velké</SelectItem>
                <SelectItem value="extra-large">Extra velké</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobilní zobrazení
          </CardTitle>
          <CardDescription>
            Nastavení specifická pro mobilní zařízení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Kompaktní režim</Label>
              <p className="text-sm text-muted-foreground">
                Zmenší rozestupy pro více obsahu na obrazovce
              </p>
            </div>
            <Switch
              checked={compactMode}
              onCheckedChange={setCompactMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('animations')}</Label>
              <p className="text-sm text-muted-foreground">
                Povolit animace a přechody
              </p>
            </div>
            <Switch
              checked={animations}
              onCheckedChange={setAnimations}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Přístupnost
          </CardTitle>
          <CardDescription>
            Nastavení pro lepší přístupnost aplikace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Vysoký kontrast</Label>
              <p className="text-sm text-muted-foreground">
                Zvýší kontrast pro lepší čitelnost
              </p>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleReset} className="flex-1">
          {t('resetToDefault')}
        </Button>
        <Button onClick={handleSave} className="flex-1">
          {t('saveChanges')}
        </Button>
      </div>
    </div>
  );
};

export default ModernAppearanceSettings;