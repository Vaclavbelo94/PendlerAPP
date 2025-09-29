import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Mail, Smartphone, Calendar, Volume2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const MobileNotificationPage = () => {
  const { t } = useTranslation('settings');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    shifts: true,
    reminders: true,
    sound: true,
    marketing: false
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const notificationSettings = [
    {
      id: 'email',
      label: t('emailNotifications'),
      description: t('emailNotificationsDesc'),
      icon: Mail,
      checked: notifications.email
    },
    {
      id: 'push',
      label: t('pushNotifications'),
      description: t('pushNotificationsDesc'),
      icon: Smartphone,
      checked: notifications.push
    },
    {
      id: 'shifts',
      label: t('shiftNotifications'),
      description: t('shiftNotificationsDesc'),
      icon: Calendar,
      checked: notifications.shifts
    },
    {
      id: 'reminders',
      label: t('reminders'),
      description: t('remindersDesc'),
      icon: Clock,
      checked: notifications.reminders
    },
    {
      id: 'sound',
      label: t('sound'),
      description: t('soundDesc'),
      icon: Volume2,
      checked: notifications.sound
    },
    {
      id: 'marketing',
      label: t('marketingEmails'),
      description: t('marketingEmailsDesc'),
      icon: Bell,
      checked: notifications.marketing
    }
  ];

  return (
    <div className="p-4 space-y-4">
      {notificationSettings.map((setting) => (
        <div key={setting.id} className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <setting.icon className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <Label className="font-medium">{setting.label}</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {setting.description}
                </p>
              </div>
            </div>
            <Switch
              checked={setting.checked}
              onCheckedChange={() => toggleNotification(setting.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileNotificationPage;