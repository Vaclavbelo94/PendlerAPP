
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Wifi, Battery, Volume2, Vibrate } from 'lucide-react';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const DeviceSettings = () => {
  const { t } = useTranslation('settings');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [backgroundSync, setBackgroundSync] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [batteryOptimization, setBatteryOptimization] = useState(true);

  useEffect(() => {
    // Load device settings from localStorage
    const savedSettings = localStorage.getItem('deviceSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setPushNotifications(parsed.pushNotifications ?? true);
        setBackgroundSync(parsed.backgroundSync ?? true);
        setVibration(parsed.vibration ?? true);
        setSoundEffects(parsed.soundEffects ?? true);
        setOfflineMode(parsed.offlineMode ?? false);
        setBatteryOptimization(parsed.batteryOptimization ?? true);
      } catch (error) {
        console.error('Error loading device settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = {
      pushNotifications,
      backgroundSync,
      vibration,
      soundEffects,
      offlineMode,
      batteryOptimization
    };
    
    localStorage.setItem('deviceSettings', JSON.stringify(settings));
    toast.success(t('settingsSaved'));
  };

  const handleReset = () => {
    setPushNotifications(true);
    setBackgroundSync(true);
    setVibration(true);
    setSoundEffects(true);
    setOfflineMode(false);
    setBatteryOptimization(true);
    localStorage.removeItem('deviceSettings');
    toast.success(t('settingsReset'));
  };

  return (
    <div className="space-y-6">
      {/* Device Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {t('device')}
          </CardTitle>
          <CardDescription>
            {t('system')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('notifications')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('enableShiftReminders')}
              </p>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                {t('synchronization')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('syncDataWithCloud')}
              </p>
            </div>
            <Switch
              checked={backgroundSync}
              onCheckedChange={setBackgroundSync}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Vibrate className="h-4 w-4" />
                {t('systemNotifications')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('shiftNotifications')}
              </p>
            </div>
            <Switch
              checked={vibration}
              onCheckedChange={setVibration}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                {t('animations')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('enableAnimationsTransitions')}
              </p>
            </div>
            <Switch
              checked={soundEffects}
              onCheckedChange={setSoundEffects}
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance & Battery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="h-5 w-5" />
            {t('appPerformance')}
          </CardTitle>
          <CardDescription>
            {t('speedAndPerformanceOptimization')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('offlineMode')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('allowWorkingOffline')}
              </p>
            </div>
            <Switch
              checked={offlineMode}
              onCheckedChange={setOfflineMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('hardwareAcceleration')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('useGpuForBetterPerformance')}
              </p>
            </div>
            <Switch
              checked={batteryOptimization}
              onCheckedChange={setBatteryOptimization}
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

export default DeviceSettings;
