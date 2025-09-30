import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Mail, Smartphone, Calendar, Volume2, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

const MobileNotificationPage = () => {
  const { t } = useTranslation('settings');
  const { unifiedUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    shifts: true,
    reminders: true,
    sound: true,
    marketing: false
  });

  useEffect(() => {
    loadNotificationSettings();
  }, [unifiedUser?.id]);

  const loadNotificationSettings = async () => {
    if (!unifiedUser?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', unifiedUser.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setNotifications({
          email: data.email_notifications ?? true,
          push: data.push_notifications ?? true,
          shifts: data.shift_reminders ?? true,
          reminders: data.shift_reminders ?? true,
          sound: true, // Not in DB yet
          marketing: false // Not in DB yet
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotification = async (key: string) => {
    if (!unifiedUser?.id) return;
    
    const newValue = !notifications[key as keyof typeof notifications];
    setNotifications(prev => ({
      ...prev,
      [key]: newValue
    }));

    try {
      const dbKey = 
        key === 'email' ? 'email_notifications' :
        key === 'push' ? 'push_notifications' :
        key === 'shifts' ? 'shift_reminders' :
        key === 'reminders' ? 'shift_reminders' :
        key;

      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: unifiedUser.id,
          [dbKey]: newValue,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      toast.success('Nastavení oznámení uloženo');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Chyba při ukládání');
      // Revert on error
      setNotifications(prev => ({
        ...prev,
        [key]: !newValue
      }));
    }
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

  if (loading) {
    return <div className="p-4">Načítání...</div>;
  }

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
