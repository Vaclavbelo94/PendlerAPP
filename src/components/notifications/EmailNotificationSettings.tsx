
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const EmailNotificationSettings = () => {
  const { t } = useTranslation('settings');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [frequency, setFrequency] = useState('daily');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          {t('emailNotifications')}
        </CardTitle>
        <CardDescription>
          {t('setShiftNotificationPreferences')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-enabled">{t('emailNotifications')}</Label>
          <Switch
            id="email-enabled"
            checked={emailEnabled}
            onCheckedChange={setEmailEnabled}
          />
        </div>
        
        {emailEnabled && (
          <div className="space-y-2">
            <Label>{t('reminderTime')}</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">{t('systemNotifications')}</SelectItem>
                <SelectItem value="daily">{t('weeklySummaries')}</SelectItem>
                <SelectItem value="weekly">{t('weeklySummaries')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
