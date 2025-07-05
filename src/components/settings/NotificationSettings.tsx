
import React, { useState, useEffect } from 'react';
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
import { SMSNotificationSettings } from '@/components/notifications/SMSNotificationSettings';
import { useNotifications } from '@/hooks/useNotifications';
import { useTranslation } from 'react-i18next';

interface NotificationSettingsProps {
  syncSettings: SyncSettings;
  updateSyncSettings: (settings: Partial<SyncSettings>) => void;
}

const NotificationSettings = ({ syncSettings, updateSyncSettings }: NotificationSettingsProps) => {
  const { preferences, updatePreferences, loading } = useNotifications();
  const { t } = useTranslation('settings');
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

      <SMSNotificationSettings />

      {/* Enhanced Shift Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('shiftNotifications')}
          </CardTitle>
          <CardDescription>
            {t('setShiftNotificationPreferences')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="shift-reminders">{t('enableShiftReminders')}</Label>
            <Switch
              id="shift-reminders"
              checked={localPreferences?.shift_reminders || false}
              onCheckedChange={(checked) => handlePreferenceChange('shift_reminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">{t('emailNotifications')}</Label>
            <Switch
              id="email-notifications"
              checked={localPreferences?.email_notifications || false}
              onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="weekly-summaries">{t('weeklySummaries')}</Label>
            <Switch
              id="weekly-summaries"
              checked={localPreferences?.weekly_summaries || false}
              onCheckedChange={(checked) => handlePreferenceChange('weekly_summaries', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">{t('smsNotifications')}</Label>
            <Switch
              id="sms-notifications"
              checked={localPreferences?.sms_notifications || false}
              onCheckedChange={(checked) => handlePreferenceChange('sms_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">{t('pushNotifications')}</Label>
            <Switch
              id="push-notifications"
              checked={localPreferences?.push_notifications || false}
              onCheckedChange={(checked) => handlePreferenceChange('push_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="immediate-notifications">{t('immediateNotifications')}</Label>
            <Switch
              id="immediate-notifications"
              checked={localPreferences?.immediate_notifications || false}
              onCheckedChange={(checked) => handlePreferenceChange('immediate_notifications', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('smsReminderAdvance')}</Label>
            <Select
              value={localPreferences?.sms_reminder_advance?.toString() || '30'}
              onValueChange={(value) => handlePreferenceChange('sms_reminder_advance', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 {t('minutes')}</SelectItem>
                <SelectItem value="30">30 {t('minutes')}</SelectItem>
                <SelectItem value="60">60 {t('minutes')}</SelectItem>
                <SelectItem value="120">2 {t('hours')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="system-updates">{t('systemNotifications')}</Label>
            <Switch
              id="system-updates"
              checked={localPreferences?.system_updates || false}
              onCheckedChange={(checked) => handlePreferenceChange('system_updates', checked)}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t('reminderTime')}
            </Label>
            <Select
              value={localPreferences?.reminder_time || '08:00:00'}
              onValueChange={(value) => handlePreferenceChange('reminder_time', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="06:00:00">06:00</SelectItem>
                <SelectItem value="07:00:00">07:00</SelectItem>
                <SelectItem value="08:00:00">08:00</SelectItem>
                <SelectItem value="09:00:00">09:00</SelectItem>
                <SelectItem value="10:00:00">10:00</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <Button onClick={handleSavePreferences} className="w-full">
            {t('savePreferences')}
          </Button>
        </CardContent>
      </Card>

      {/* General Notifications Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('systemNotifications')}
          </CardTitle>
          <CardDescription>
            {t('basicSettings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="syncNotifications">{t('synchronization')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('syncStatus')}
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
