
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from 'react-i18next';

interface NotificationSettingsProps {
  emailNotifications: boolean;
  shiftNotifications: boolean;
  languageReminders: boolean;
  handleInputChange: (field: string, value: boolean) => void;
}

const NotificationSettings = ({
  emailNotifications,
  shiftNotifications,
  languageReminders,
  handleInputChange,
}: NotificationSettingsProps) => {
  const { t } = useTranslation('profile');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t('notificationSettings')}</h3>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="emailNotifications">{t('emailNotifications')}</Label>
          <p className="text-sm text-muted-foreground">
            {t('receiveEmailNotifications')}
          </p>
        </div>
        <Switch
          id="emailNotifications"
          checked={emailNotifications}
          onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="shiftNotifications">{t('shiftNotifications')}</Label>
          <p className="text-sm text-muted-foreground">
            {t('shiftNotificationsDescription')}
          </p>
        </div>
        <Switch
          id="shiftNotifications"
          checked={shiftNotifications}
          onCheckedChange={(checked) => handleInputChange('shiftNotifications', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="languageReminders">{t('languageReminders')}</Label>
          <p className="text-sm text-muted-foreground">
            {t('languageRemindersDescription')}
          </p>
        </div>
        <Switch
          id="languageReminders"
          checked={languageReminders}
          onCheckedChange={(checked) => handleInputChange('languageReminders', checked)}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
