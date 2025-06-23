
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Zap, Database } from 'lucide-react';
import HealthMonitor from '@/components/monitoring/HealthMonitor';
import AudioSettings from '@/components/profile/settings/AudioSettings';
import { useTranslation } from 'react-i18next';

const SystemSettings = () => {
  const { t } = useTranslation('settings');

  return (
    <div className="space-y-6">
      {/* Audio Settings */}
      <AudioSettings />

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('security')}
          </CardTitle>
          <CardDescription>
            {t('securityAndPrivacySettings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('twoFactorAuth')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('additionalAccountProtection')}
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('autoLogout')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('logoutAfter30MinInactivity')}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t('appPerformance')}
          </CardTitle>
          <CardDescription>
            {t('speedAndPerformanceOptimization')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('hardwareAcceleration')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('useGpuForBetterPerformance')}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('preloadPages')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('fasterLoadingDuringNavigation')}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Button variant="outline" className="w-full sm:w-auto">
            {t('clearCache')}
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('dataManagement')}
          </CardTitle>
          <CardDescription>
            {t('exportImportBackupData')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              {t('exportData')}
            </Button>
            <Button variant="outline">
              {t('importData')}
            </Button>
            <Button variant="outline">
              {t('createBackup')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Health Monitor */}
      <HealthMonitor />
    </div>
  );
};

export default SystemSettings;
