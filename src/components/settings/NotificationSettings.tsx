
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Smartphone, Clock, Calendar } from 'lucide-react';
import { toast } from "sonner";
import { SyncSettings } from '@/hooks/useSyncSettings';
import { EmailNotificationSettings } from '@/components/notifications/EmailNotificationSettings';
import { PushNotificationSettings } from '@/components/notifications/PushNotificationSettings';

interface NotificationSettings {
  enabled: boolean;
  beforeShift: number;
  dailyReminder: boolean;
  weeklyReminder: boolean;
  reminderTime: string;
}

interface NotificationSettingsProps {
  syncSettings: SyncSettings;
  updateSyncSettings: (settings: Partial<SyncSettings>) => void;
}

const NotificationSettings = ({ syncSettings, updateSyncSettings }: NotificationSettingsProps) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [vocabularyReminders, setVocabularyReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState("30");

  // Shift notification settings
  const [shiftNotificationSettings, setShiftNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    beforeShift: 30,
    dailyReminder: false,
    weeklyReminder: false,
    reminderTime: "08:00"
  });

  const handleSaveSettings = () => {
    toast.success("Nastavení oznámení byla uložena");
  };

  const handleSaveShiftNotifications = () => {
    localStorage.setItem('shiftNotificationSettings', JSON.stringify(shiftNotificationSettings));
    
    if (shiftNotificationSettings.enabled && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          toast.success("Nastavení notifikací směn bylo uloženo");
        } else {
          toast.error("Pro notifikace je potřeba povolit oznámení v prohlížeči");
        }
      });
    } else {
      toast.success("Nastavení notifikací směn bylo uloženo");
    }
  };

  return (
    <div className="space-y-6">
      <EmailNotificationSettings />
      
      <PushNotificationSettings />

      {/* New Shift Notifications Section */}
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
            <Label htmlFor="shift-notifications-enabled">Povolit notifikace směn</Label>
            <Switch
              id="shift-notifications-enabled"
              checked={shiftNotificationSettings.enabled}
              onCheckedChange={(enabled) => setShiftNotificationSettings(prev => ({ ...prev, enabled }))}
            />
          </div>
          
          {shiftNotificationSettings.enabled && (
            <>
              <div className="space-y-2">
                <Label>Upozornit před směnou</Label>
                <Select
                  value={shiftNotificationSettings.beforeShift.toString()}
                  onValueChange={(value) => setShiftNotificationSettings(prev => ({ ...prev, beforeShift: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minut</SelectItem>
                    <SelectItem value="30">30 minut</SelectItem>
                    <SelectItem value="60">1 hodina</SelectItem>
                    <SelectItem value="120">2 hodiny</SelectItem>
                    <SelectItem value="1440">1 den</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="daily-reminder">Denní připomínka</Label>
                <Switch
                  id="daily-reminder"
                  checked={shiftNotificationSettings.dailyReminder}
                  onCheckedChange={(dailyReminder) => setShiftNotificationSettings(prev => ({ ...prev, dailyReminder }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="weekly-reminder">Týdenní souhrn</Label>
                <Switch
                  id="weekly-reminder"
                  checked={shiftNotificationSettings.weeklyReminder}
                  onCheckedChange={(weeklyReminder) => setShiftNotificationSettings(prev => ({ ...prev, weeklyReminder }))}
                />
              </div>
              
              {(shiftNotificationSettings.dailyReminder || shiftNotificationSettings.weeklyReminder) && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Čas připomínky
                  </Label>
                  <Select
                    value={shiftNotificationSettings.reminderTime}
                    onValueChange={(reminderTime) => setShiftNotificationSettings(prev => ({ ...prev, reminderTime }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06:00">6:00</SelectItem>
                      <SelectItem value="08:00">8:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={handleSaveShiftNotifications} className="w-full">
                Uložit nastavení směn
              </Button>
            </>
          )}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Připomenutí
          </CardTitle>
          <CardDescription>
            Nastavení automatických připomenutí
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="vocabularyReminders">Připomenutí slovíček</Label>
              <p className="text-sm text-muted-foreground">
                Dostávat připomenutí pro opakování slovíček
              </p>
            </div>
            <Switch
              id="vocabularyReminders"
              checked={vocabularyReminders}
              onCheckedChange={setVocabularyReminders}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderTime">Čas připomenutí před směnou</Label>
            <Select value={reminderTime} onValueChange={setReminderTime}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte čas připomenutí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minut</SelectItem>
                <SelectItem value="30">30 minut</SelectItem>
                <SelectItem value="60">1 hodina</SelectItem>
                <SelectItem value="120">2 hodiny</SelectItem>
                <SelectItem value="240">4 hodiny</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Uložit nastavení
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
