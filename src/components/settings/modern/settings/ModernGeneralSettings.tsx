import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Clock, Wifi, Bell, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ModernGeneralSettings = () => {
  const { t } = useTranslation('settings');
  const [autoSave, setAutoSave] = useState(true);
  const [startupScreen, setStartupScreen] = useState('dashboard');
  const [offlineMode, setOfflineMode] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [vibrations, setVibrations] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('generalSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setAutoSave(parsed.autoSave ?? true);
        setStartupScreen(parsed.startupScreen ?? 'dashboard');
        setOfflineMode(parsed.offlineMode ?? true);
        setSystemNotifications(parsed.systemNotifications ?? true);
        setVibrations(parsed.vibrations ?? true);
        setAutoBackup(parsed.autoBackup ?? false);
      } catch (error) {
        console.error('Error loading general settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = {
      autoSave,
      startupScreen,
      offlineMode,
      systemNotifications,
      vibrations,
      autoBackup
    };
    
    localStorage.setItem('generalSettings', JSON.stringify(settings));
    toast.success(t('settingsSaved'));
  };

  const handleReset = () => {
    setAutoSave(true);
    setStartupScreen('dashboard');
    setOfflineMode(true);
    setSystemNotifications(true);
    setVibrations(true);
    setAutoBackup(false);
    localStorage.removeItem('generalSettings');
    toast.success(t('settingsReset'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('basicSettings')}
          </CardTitle>
          <CardDescription>
            Základní nastavení aplikace a chování
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('autoSave')}</Label>
              <p className="text-sm text-muted-foreground">
                Automaticky ukládat změny bez potvrzení
              </p>
            </div>
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>

          <div className="space-y-2">
            <Label>Úvodní obrazovka</Label>
            <Select value={startupScreen} onValueChange={setStartupScreen}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="shifts">Směny</SelectItem>
                <SelectItem value="calendar">Kalendář</SelectItem>
                <SelectItem value="reports">Reporty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Offline režim
          </CardTitle>
          <CardDescription>
            Nastavení práce bez internetového připojení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Povolit offline režim</Label>
              <p className="text-sm text-muted-foreground">
                Umožní používat aplikaci bez internetu
              </p>
            </div>
            <Switch
              checked={offlineMode}
              onCheckedChange={setOfflineMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatické zálohování</Label>
              <p className="text-sm text-muted-foreground">
                Pravidelně zálohovat data do cloudu
              </p>
            </div>
            <Switch
              checked={autoBackup}
              onCheckedChange={setAutoBackup}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobilní nastavení
          </CardTitle>
          <CardDescription>
            Nastavení specifická pro mobilní zařízení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Systémová oznámení</Label>
              <p className="text-sm text-muted-foreground">
                Zobrazovat oznámení v systému
              </p>
            </div>
            <Switch
              checked={systemNotifications}
              onCheckedChange={setSystemNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Vibrace</Label>
              <p className="text-sm text-muted-foreground">
                Vibrovat při důležitých událostech
              </p>
            </div>
            <Switch
              checked={vibrations}
              onCheckedChange={setVibrations}
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

export default ModernGeneralSettings;