import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SettingItem from '../SettingItem';
import { toast } from 'sonner';

interface NotificationSettingsProps {
  onBack: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState('30');

  const reminderTimeOptions = [
    { value: '15', label: t('minutes15') },
    { value: '30', label: t('minutes30') },
    { value: '60', label: t('hour1') },
    { value: '120', label: t('hours2') }
  ];

  const handleNotificationChange = (type: string, value: boolean) => {
    switch (type) {
      case 'email':
        setEmailNotifications(value);
        break;
      case 'push':
        setPushNotifications(value);
        break;
      case 'shifts':
        setShiftReminders(value);
        break;
    }
    toast.success(t('notificationUpdated'));
  };

  const handleReminderTimeChange = (time: string) => {
    setReminderTime(time);
    toast.success(t('reminderTimeUpdated'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold">{t('notifications')}</h2>
        </div>

        <div className="space-y-6">
          {/* General Notifications */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('generalNotifications')}</h3>
            <div className="space-y-4">
              <SettingItem
                title={t('emailNotifications')}
                description={t('emailNotificationsDescription')}
                type="toggle"
                value={emailNotifications}
                onChange={(value) => handleNotificationChange('email', value)}
              />
              <SettingItem
                title={t('pushNotifications')}
                description={t('pushNotificationsDescription')}
                type="toggle"
                value={pushNotifications}
                onChange={(value) => handleNotificationChange('push', value)}
              />
            </div>
          </Card>

          {/* Shift Notifications */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('shiftNotifications')}</h3>
            <div className="space-y-4">
              <SettingItem
                title={t('shiftReminders')}
                description={t('shiftRemindersDescription')}
                type="toggle"
                value={shiftReminders}
                onChange={(value) => handleNotificationChange('shifts', value)}
              />
              {shiftReminders && (
                <SettingItem
                  title={t('reminderTime')}
                  description={t('reminderTimeDescription')}
                  type="select"
                  value={reminderTime}
                  onChange={handleReminderTimeChange}
                  options={reminderTimeOptions}
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