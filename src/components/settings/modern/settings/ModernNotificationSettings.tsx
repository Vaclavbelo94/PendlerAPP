import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Smartphone, Clock, MessageSquare, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { SyncSettings } from '@/hooks/useSyncSettings';

interface ModernNotificationSettingsProps {
  syncSettings?: SyncSettings;
  updateSyncSettings?: (settings: Partial<SyncSettings>) => Promise<boolean>;
}

const ModernNotificationSettings: React.FC<ModernNotificationSettingsProps> = ({
  syncSettings,
  updateSyncSettings
}) => {
  const { t } = useTranslation('settings');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [scheduleChanges, setScheduleChanges] = useState(true);
  const [reminderTime, setReminderTime] = useState('30');
  const [quietHours, setQuietHours] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');

  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setPushEnabled(parsed.pushEnabled ?? true);
        setEmailEnabled(parsed.emailEnabled ?? true);
        setSmsEnabled(parsed.smsEnabled ?? false);
        setShiftReminders(parsed.shiftReminders ?? true);
        setScheduleChanges(parsed.scheduleChanges ?? true);
        setReminderTime(parsed.reminderTime ?? '30');
        setQuietHours(parsed.quietHours ?? false);
        setQuietStart(parsed.quietStart ?? '22:00');
        setQuietEnd(parsed.quietEnd ?? '07:00');
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  const handleSave = async () => {
    const settings = {
      pushEnabled,
      emailEnabled,
      smsEnabled,
      shiftReminders,
      scheduleChanges,
      reminderTime,
      quietHours,
      quietStart,
      quietEnd
    };
    
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    
    // Note: Notification settings are stored locally, not in sync settings
    // updateSyncSettings is for sync-specific settings only
    
    toast.success(t('settingsSaved'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications')}
          </CardTitle>
          <CardDescription>
            Nastavte si, jak a kdy chcete dostávat oznámení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Push oznámení
              </Label>
              <p className="text-sm text-muted-foreground">
                Okamžitá oznámení na zařízení
              </p>
            </div>
            <Switch
              checked={pushEnabled}
              onCheckedChange={setPushEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-mailová oznámení
              </Label>
              <p className="text-sm text-muted-foreground">
                Oznámení zaslaná na e-mail
              </p>
            </div>
            <Switch
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS oznámení
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Pro
                </Badge>
              </Label>
              <p className="text-sm text-muted-foreground">
                Kritická oznámení přes SMS
              </p>
            </div>
            <Switch
              checked={smsEnabled}
              onCheckedChange={setSmsEnabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Směnová oznámení
          </CardTitle>
          <CardDescription>
            Nastavení pro oznámení o směnách a rozvrhu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Připomínky směn</Label>
              <p className="text-sm text-muted-foreground">
                Upozornění před začátkem směny
              </p>
            </div>
            <Switch
              checked={shiftReminders}
              onCheckedChange={setShiftReminders}
            />
          </div>

          {shiftReminders && (
            <div className="space-y-2 pl-4 border-l-2 border-border">
              <Label>Čas připomínky</Label>
              <Select value={reminderTime} onValueChange={setReminderTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minut před</SelectItem>
                  <SelectItem value="30">30 minut před</SelectItem>
                  <SelectItem value="60">1 hodinu před</SelectItem>
                  <SelectItem value="120">2 hodiny před</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Změny v rozvrhu</Label>
              <p className="text-sm text-muted-foreground">
                Oznámení o změnách směn
              </p>
            </div>
            <Switch
              checked={scheduleChanges}
              onCheckedChange={setScheduleChanges}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tichý režim
          </CardTitle>
          <CardDescription>
            Nastavte dobu, kdy nechcete dostávat oznámení
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Povolit tichý režim</Label>
              <p className="text-sm text-muted-foreground">
                Potlačit oznámení v určenou dobu
              </p>
            </div>
            <Switch
              checked={quietHours}
              onCheckedChange={setQuietHours}
            />
          </div>

          {quietHours && (
            <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-border">
              <div className="space-y-2">
                <Label>Začátek</Label>
                <Select value={quietStart} onValueChange={setQuietStart}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="21:00">21:00</SelectItem>
                    <SelectItem value="22:00">22:00</SelectItem>
                    <SelectItem value="23:00">23:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Konec</Label>
                <Select value={quietEnd} onValueChange={setQuietEnd}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00">06:00</SelectItem>
                    <SelectItem value="07:00">07:00</SelectItem>
                    <SelectItem value="08:00">08:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          {t('saveChanges')}
        </Button>
      </div>
    </div>
  );
};

export default ModernNotificationSettings;