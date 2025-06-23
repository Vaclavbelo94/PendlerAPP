
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BasicSettingsCardProps {
  autoSave: boolean;
  setAutoSave: (value: boolean) => void;
  compactMode: boolean;
  setCompactMode: (value: boolean) => void;
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  defaultView: string;
  setDefaultView: (value: string) => void;
}

const BasicSettingsCard = ({
  autoSave,
  setAutoSave,
  compactMode,
  setCompactMode,
  autoRefresh,
  setAutoRefresh,
  defaultView,
  setDefaultView
}: BasicSettingsCardProps) => {
  const { t } = useTranslation('settings');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('basicSettings')}
        </CardTitle>
        <CardDescription>
          {t('applicationBehavior')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('autoSave')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('saveChangesAutomatically')}
            </p>
          </div>
          <Switch checked={autoSave} onCheckedChange={setAutoSave} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('compactMode')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('showMoreContentOnScreen')}
            </p>
          </div>
          <Switch checked={compactMode} onCheckedChange={setCompactMode} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('autoRefresh')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('refreshDataEvery5Minutes')}
            </p>
          </div>
          <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
        </div>

        <div className="space-y-2">
          <Label>{t('defaultView')}</Label>
          <Select value={defaultView} onValueChange={setDefaultView}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('selectDefaultPageAfterLogin')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dashboard">{t('dashboard')}</SelectItem>
              <SelectItem value="shifts">{t('shifts')}</SelectItem>
              <SelectItem value="profile">{t('profile')}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {t('selectDefaultPageAfterLogin')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicSettingsCard;
