import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Bell, Mail, Smartphone, Calendar, Clock, Volume2, Vibrate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface MobileNotificationSettingsProps {
  onBack: () => void;
}

const MobileNotificationSettings: React.FC<MobileNotificationSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sound: true,
    vibration: true,
    shifts: true,
    reminders: true,
    marketing: false,
    security: true
  });

  const [timing, setTiming] = useState({
    quietHoursEnabled: true,
    quietStart: '22:00',
    quietEnd: '07:00',
    reminderTime: '60' // minutes before
  });

  const handleSave = () => {
    toast.success(t('notificationsSaved'));
  };

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{t('notifications')}</h1>
            <p className="text-sm text-muted-foreground">{t('notificationsDescription')}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* General Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t('generalNotifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label>{t('emailNotifications')}</Label>
                  <p className="text-sm text-muted-foreground">{t('emailNotificationsDesc')}</p>
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={() => toggleNotification('email')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label>{t('pushNotifications')}</Label>
                  <p className="text-sm text-muted-foreground">{t('pushNotificationsDesc')}</p>
                </div>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={() => toggleNotification('push')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sound & Vibration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              {t('soundVibration')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label>{t('sound')}</Label>
                  <p className="text-sm text-muted-foreground">{t('soundDesc')}</p>
                </div>
              </div>
              <Switch
                checked={notifications.sound}
                onCheckedChange={() => toggleNotification('sound')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label>{t('vibration')}</Label>
                  <p className="text-sm text-muted-foreground">{t('vibrationDesc')}</p>
                </div>
              </div>
              <Switch
                checked={notifications.vibration}
                onCheckedChange={() => toggleNotification('vibration')}
              />
            </div>
          </CardContent>
        </Card>

        {/* App-specific Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('appNotifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('shiftNotifications')}</Label>
                <p className="text-sm text-muted-foreground">{t('shiftNotificationsDesc')}</p>
              </div>
              <Switch
                checked={notifications.shifts}
                onCheckedChange={() => toggleNotification('shifts')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>{t('reminders')}</Label>
                <p className="text-sm text-muted-foreground">{t('remindersDesc')}</p>
              </div>
              <Switch
                checked={notifications.reminders}
                onCheckedChange={() => toggleNotification('reminders')}
              />
            </div>

            {notifications.reminders && (
              <div className="ml-4 p-3 bg-muted/30 rounded-lg">
                <Label className="text-sm">{t('reminderTiming')}</Label>
                <Select 
                  value={timing.reminderTime} 
                  onValueChange={(value) => setTiming(prev => ({ ...prev, reminderTime: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 {t('minutesBefore')}</SelectItem>
                    <SelectItem value="30">30 {t('minutesBefore')}</SelectItem>
                    <SelectItem value="60">1 {t('hourBefore')}</SelectItem>
                    <SelectItem value="120">2 {t('hoursBefore')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('quietHours')}
            </CardTitle>
            <CardDescription>
              {t('quietHoursDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('enableQuietHours')}</Label>
              <Switch
                checked={timing.quietHoursEnabled}
                onCheckedChange={(checked) => setTiming(prev => ({ ...prev, quietHoursEnabled: checked }))}
              />
            </div>

            {timing.quietHoursEnabled && (
              <div className="space-y-4 ml-4 p-3 bg-muted/30 rounded-lg">
                <div>
                  <Label className="text-sm">{t('startTime')}</Label>
                  <Select 
                    value={timing.quietStart} 
                    onValueChange={(value) => setTiming(prev => ({ ...prev, quietStart: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {`${i.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">{t('endTime')}</Label>
                  <Select 
                    value={timing.quietEnd} 
                    onValueChange={(value) => setTiming(prev => ({ ...prev, quietEnd: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                          {`${i.toString().padStart(2, '0')}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy & Marketing */}
        <Card>
          <CardHeader>
            <CardTitle>{t('privacyMarketing')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('marketingEmails')}</Label>
                <p className="text-sm text-muted-foreground">{t('marketingEmailsDesc')}</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={() => toggleNotification('marketing')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>{t('securityAlerts')}</Label>
                <p className="text-sm text-muted-foreground">{t('securityAlertsDesc')}</p>
              </div>
              <Switch
                checked={notifications.security}
                onCheckedChange={() => toggleNotification('security')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-4">
          <Button onClick={handleSave} className="w-full">
            {t('saveChanges')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileNotificationSettings;