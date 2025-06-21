
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Zap, Database } from 'lucide-react';
import HealthMonitor from '@/components/monitoring/HealthMonitor';
import AudioSettings from '@/components/profile/settings/AudioSettings';
import { useLanguage } from '@/hooks/useLanguage';

const SystemSettings = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Audio Settings */}
      <AudioSettings />

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('security') || 'Zabezpečení'}
          </CardTitle>
          <CardDescription>
            {t('securityAndPrivacySettings') || 'Nastavení bezpečnosti a soukromí'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('twoFactorAuth') || 'Dvou-faktorové ověření'}</Label>
              <p className="text-sm text-muted-foreground">
                {t('additionalAccountProtection') || 'Dodatečná ochrana vašeho účtu'}
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('autoLogout') || 'Automatické odhlášení'}</Label>
              <p className="text-sm text-muted-foreground">
                {t('logoutAfter30MinInactivity') || 'Odhlásit po 30 minutách nečinnosti'}
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
            {t('appPerformance') || 'Výkon aplikace'}
          </CardTitle>
          <CardDescription>
            {t('speedAndPerformanceOptimization') || 'Optimalizace rychlosti a výkonu'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('hardwareAcceleration') || 'Hardwarová akcelerace'}</Label>
              <p className="text-sm text-muted-foreground">
                {t('useGpuForBetterPerformance') || 'Využít GPU pro lepší výkon'}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('preloadPages') || 'Předem načítat stránky'}</Label>
              <p className="text-sm text-muted-foreground">
                {t('fasterLoadingDuringNavigation') || 'Rychlejší načítání při navigaci'}
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Button variant="outline" className="w-full sm:w-auto">
            {t('clearCache') || 'Vymazat cache'}
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('dataManagement') || 'Správa dat'}
          </CardTitle>
          <CardDescription>
            {t('exportImportBackupData') || 'Export, import a záloha dat'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              {t('exportData') || 'Exportovat data'}
            </Button>
            <Button variant="outline">
              {t('importData') || 'Importovat data'}
            </Button>
            <Button variant="outline">
              {t('createBackup') || 'Vytvořit zálohu'}
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
