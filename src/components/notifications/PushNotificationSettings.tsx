
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PushNotificationSettings = () => {
  const { t } = useTranslation('settings');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          {t('systemNotifications')}
        </CardTitle>
        <CardDescription>
          {t('shiftNotifications')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="push-enabled">{t('enableShiftReminders')}</Label>
          <Switch
            id="push-enabled"
            checked={pushEnabled}
            onCheckedChange={setPushEnabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="sound-enabled">{t('animations')}</Label>
          <Switch
            id="sound-enabled"
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};
