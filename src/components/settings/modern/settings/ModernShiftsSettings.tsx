import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Bell, Zap, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ModernShiftsSettings = () => {
  const { t } = useTranslation('settings');
  const [autoGeneration, setAutoGeneration] = useState(false);
  const [calendarSync, setCalendarSync] = useState(true);
  const [smartReminders, setSmartReminders] = useState(true);
  const [locationReminders, setLocationReminders] = useState(false);
  const [defaultShiftLength, setDefaultShiftLength] = useState('8');
  const [reminderAdvance, setReminderAdvance] = useState('30');

  const handleSave = () => {
    const settings = {
      autoGeneration,
      calendarSync,
      smartReminders,
      locationReminders,
      defaultShiftLength,
      reminderAdvance
    };
    
    localStorage.setItem('shiftSettings', JSON.stringify(settings));
    toast.success(t('settingsSaved'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Správa směn
          </CardTitle>
          <CardDescription>
            Automatizace a nastavení pro vaše směny
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('autoShiftGeneration')}</Label>
              <p className="text-sm text-muted-foreground">
                Automaticky vytvářet směny na základě vašeho rozvrhu
              </p>
            </div>
            <Switch
              checked={autoGeneration}
              onCheckedChange={setAutoGeneration}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('calendarSync')}</Label>
              <p className="text-sm text-muted-foreground">
                Synchronizovat směny s kalendářem zařízení
              </p>
            </div>
            <Switch
              checked={calendarSync}
              onCheckedChange={setCalendarSync}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shiftLength">Výchozí délka směny</Label>
            <Select value={defaultShiftLength} onValueChange={setDefaultShiftLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 hodin</SelectItem>
                <SelectItem value="8">8 hodin</SelectItem>
                <SelectItem value="10">10 hodin</SelectItem>
                <SelectItem value="12">12 hodin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Připomínky směn
          </CardTitle>
          <CardDescription>
            Nastavení upozornění a připomínek
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('smartNotifications')}</Label>
              <p className="text-sm text-muted-foreground">
                Inteligentní připomínky na základě vzdálenosti a dopravy
              </p>
            </div>
            <Switch
              checked={smartReminders}
              onCheckedChange={setSmartReminders}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('locationBasedReminders')}</Label>
              <p className="text-sm text-muted-foreground">
                Připomínky podle vaší aktuální polohy
              </p>
            </div>
            <Switch
              checked={locationReminders}
              onCheckedChange={setLocationReminders}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderAdvance">Předstih připomínky</Label>
            <Select value={reminderAdvance} onValueChange={setReminderAdvance}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minut</SelectItem>
                <SelectItem value="30">30 minut</SelectItem>
                <SelectItem value="60">1 hodina</SelectItem>
                <SelectItem value="120">2 hodiny</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

export default ModernShiftsSettings;