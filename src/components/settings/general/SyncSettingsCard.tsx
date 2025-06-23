
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Cloud } from 'lucide-react';
import { SyncSettings } from '@/hooks/useSyncSettings';
import { useTranslation } from 'react-i18next';

interface SyncSettingsCardProps {
  syncSettings: SyncSettings;
  updateSyncSettings: (settings: Partial<SyncSettings>) => Promise<boolean>;
  syncLoading: boolean;
  formatLastSyncTime: (time?: Date | null) => string;
}

const SyncSettingsCard: React.FC<SyncSettingsCardProps> = ({
  syncSettings,
  updateSyncSettings,
  syncLoading,
  formatLastSyncTime
}) => {
  const { t } = useTranslation('settings');

  const handleManualSync = () => {
    // Trigger manual sync
    console.log('Manual sync triggered');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          {t('dataSync')}
        </CardTitle>
        <CardDescription>
          {t('syncSettingsBetweenDevices')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="backgroundSync">{t('backgroundSync')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('autoSyncWhenInactive')}
            </p>
          </div>
          <Switch
            id="backgroundSync"
            checked={syncSettings.enableBackgroundSync}
            onCheckedChange={(checked) => updateSyncSettings({ enableBackgroundSync: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="syncNotifications">{t('syncNotifications')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('showSyncStatusNotifications')}
            </p>
          </div>
          <Switch
            id="syncNotifications"
            checked={syncSettings.showSyncNotifications}
            onCheckedChange={(checked) => updateSyncSettings({ showSyncNotifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">{t('lastSync')}</p>
            <p className="text-sm text-muted-foreground">
              {formatLastSyncTime(syncSettings.lastSyncTime)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                {syncSettings.enableBackgroundSync ? t('active') : t('inactive')}
              </Badge>
            </div>
          </div>
          <Button 
            onClick={handleManualSync} 
            disabled={syncLoading}
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncLoading ? 'animate-spin' : ''}`} />
            {syncLoading ? t('syncing') : t('synchronize')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SyncSettingsCard;
