
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Clock } from 'lucide-react';
import { EmailNotificationSettings } from '@/components/notifications/EmailNotificationSettings';
import { PushNotificationSettings } from '@/components/notifications/PushNotificationSettings';
import { useNotifications } from '@/hooks/useNotifications';
import { SyncSettings } from '@/hooks/useSyncSettings';

interface NotificationSettingsProps {
  syncSettings: SyncSettings;
  updateSyncSettings: (settings: Partial<SyncSettings>) => void;
}

const NotificationSettings = ({ syncSettings, updateSyncSettings }: NotificationSettingsProps) => {
  const { preferences, updatePreferences, loading } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState(preferences);

  useEffect(() => {
    if (preferences) {
      setLocalPreferences(preferences);
    }
  }, [preferences]);

  const handlePreferenceChange = (key: string, value: any) => {
    setLocalPreferences(prev => prev ? { ...prev, [key]: value } : null);
  };

  const handleSavePreferences = async () => {
    if (!localPreferences) return;
    await updatePreferences(localPreferences);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmailNotificationSettings />
      
      <PushNotificationSettings />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Oznámení o směnách
          </CardTitle>
          <CardDescription>
            Nastavte, kdy chcete být upozorněni na nadcházející směny
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="shift-reminders">Povolit připomínky směn</Label>
            <Switch
              id="shift-reminders"
              checked={localPreferences?.shift_reminders || false}
              onCheckedChange={(checked) => handlePreferenceChange('shift_reminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">E-mailová oznámení</Label>
            <Switch
              id="email-notifications"
              checked={localPreferences?.email_notifications || false}
              onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="weekly-summaries">Týdenní souhrny</Label>
            <Switch
              id="weekly-summaries"
              checked={localPreferences?.weekly_summaries || false}
              onCheckedChange={(checked) => handlePreferenceChange('weekly_summaries', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="system-updates">Systémová oznámení</Label>
            <Switch
              id="system-updates"
              checked={localPreferences?.system_updates || false}
              onCheckedChange={(checked) => handlePreferenceChange('system_updates', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Čas připomínky
            </Label>
            <Select
              value={localPreferences?.reminder_time || '08:00:00'}
              onValueChange={(value) => handlePreferenceChange('reminder_time', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="06:00:00">6:00</SelectItem>
                <SelectItem value="08:00:00">8:00</SelectItem>
                <SelectItem value="10:00:00">10:00</SelectItem>
                <SelectItem value="12:00:00">12:00</SelectItem>
                <SelectItem value="18:00:00">18:00</SelectItem>
                <SelectItem value="20:00:00">20:00</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSavePreferences} className="w-full">
            Uložit nastavení
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Obecná oznámení
          </CardTitle>
          <CardDescription>
            Základní nastavení notifikací v aplikaci
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="syncNotifications">Oznámení o synchronizaci</Label>
              <p className="text-sm text-muted-foreground">
                Zobrazovat stav synchronizace dat
              </p>
            </div>
            <Switch
              id="syncNotifications"
              checked={syncSettings.showSyncNotifications}
              onCheckedChange={(checked) => updateSyncSettings({ showSyncNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
