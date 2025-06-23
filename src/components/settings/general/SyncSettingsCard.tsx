
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Cloud, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SyncSettingsCardProps {
  syncSettings: any;
  updateSyncSettings: (settings: any) => void;
  syncLoading: boolean;
  formatLastSyncTime: (time?: Date | null) => string;
}

const SyncSettingsCard = ({
  syncSettings,
  updateSyncSettings,
  syncLoading,
  formatLastSyncTime
}: SyncSettingsCardProps) => {
  const { t } = useTranslation('settings');
  
  const handleSyncSettingChange = (key: string, value: boolean) => {
    updateSyncSettings({
      ...syncSettings,
      [key]: value
    });
  };

  const handleForceSync = () => {
    // Force sync implementation
    console.log('Force sync triggered');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          {t('synchronization')}
        </CardTitle>
        <CardDescription>
          {t('dataSyncSettings')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('cloudSync')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('syncDataWithCloud')}
            </p>
          </div>
          <Switch 
            checked={syncSettings?.cloudSync || false}
            onCheckedChange={(checked) => handleSyncSettingChange('cloudSync', checked)}
            disabled={syncLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('autoSync')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('syncEvery15Minutes')}
            </p>
          </div>
          <Switch 
            checked={syncSettings?.autoSync || false}
            onCheckedChange={(checked) => handleSyncSettingChange('autoSync', checked)}
            disabled={syncLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>{t('offlineMode')}</Label>
            <p className="text-sm text-muted-foreground">
              {t('allowWorkingOffline')}
            </p>
          </div>
          <Switch 
            checked={syncSettings?.offlineMode || false}
            onCheckedChange={(checked) => handleSyncSettingChange('offlineMode', checked)}
            disabled={syncLoading}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('syncStatus')}</Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t('lastSync')}: {formatLastSyncTime(syncSettings?.lastSyncTime)}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleForceSync}
              disabled={syncLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncLoading ? 'animate-spin' : ''}`} />
              {syncLoading ? t('syncNow') : t('forceSync')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SyncSettingsCard;
