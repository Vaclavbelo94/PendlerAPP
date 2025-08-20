import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Mail, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserSettings } from '@/hooks/useUserSettings';
import SettingItem from '../SettingItem';

interface NotificationSettingsProps {
  onBack: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  const { settings, updateSetting, isSaving } = useUserSettings();

  const reminderTimeOptions = [
    { value: '06:00:00', label: '06:00' },
    { value: '07:00:00', label: '07:00' },
    { value: '08:00:00', label: '08:00' },
    { value: '09:00:00', label: '09:00' },
    { value: '10:00:00', label: '10:00' }
  ];

  const handleSettingChange = async (key: keyof typeof settings, value: any) => {
    const success = await updateSetting(key, value);
    if (success) {
      toast.success(t('settingsSaved'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-semibold">{t('notifications')}</h2>
        </div>

        <div className="space-y-6">
          {/* General Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('general')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('pushNotifications')}
                description={t('pushNotificationsDescription')}
                type="toggle"
                value={settings.push_notifications}
                onChange={(value) => handleSettingChange('push_notifications', value)}
                disabled={isSaving}
              />
              
              <SettingItem
                title={t('systemUpdates')}
                description={t('systemUpdatesDescription')}
                type="toggle"
                value={settings.system_updates}
                onChange={(value) => handleSettingChange('system_updates', value)}
                disabled={isSaving}
              />
            </div>
          </Card>

          {/* Email Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('email')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('emailNotifications')}
                description={t('emailNotificationsDescription')}
                type="toggle"
                value={settings.email_notifications}
                onChange={(value) => handleSettingChange('email_notifications', value)}
                disabled={isSaving}
              />
              
              <SettingItem
                title={t('weeklySummaries')}
                description={t('weeklySummariesDescription')}
                type="toggle"
                value={settings.weekly_summaries}
                onChange={(value) => handleSettingChange('weekly_summaries', value)}
                disabled={isSaving}
              />
            </div>
          </Card>

          {/* Shift Reminders */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('shiftReminders')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('shiftReminders')}
                description={t('shiftRemindersDescription')}
                type="toggle"
                value={settings.shift_reminders}
                onChange={(value) => handleSettingChange('shift_reminders', value)}
                disabled={isSaving}
              />
              
              {settings.shift_reminders && (
                <SettingItem
                  title={t('reminderTime')}
                  description={t('reminderTimeDescription')}
                  type="select"
                  value={settings.reminder_time}
                  onChange={(value) => handleSettingChange('reminder_time', value)}
                  options={reminderTimeOptions}
                  disabled={isSaving}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;