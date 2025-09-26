import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Settings, Database, RefreshCw, Trash2, Download, Upload, Shield, Info, HardDrive, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface MobileSystemSettingsProps {
  onBack: () => void;
}

const MobileSystemSettings: React.FC<MobileSystemSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  
  const [system, setSystem] = useState({
    autoSync: true,
    offlineMode: false,
    cacheSize: '500',
    autoBackup: true,
    debugMode: false
  });

  const [storage] = useState({
    used: 245,
    total: 1000,
    cache: 89,
    documents: 156
  });

  const handleSave = () => {
    toast.success(t('systemSettingsSaved'));
  };

  const handleClearCache = () => {
    toast.success(t('cacheCleared'));
  };

  const handleExportData = () => {
    toast.info(t('dataExportNotImplemented'));
  };

  const handleImportData = () => {
    toast.info(t('dataImportNotImplemented'));
  };

  const handleFactoryReset = () => {
    toast.error(t('factoryResetConfirmation'));
  };

  const toggleSystem = (key: string) => {
    setSystem(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{t('system')}</h1>
            <p className="text-sm text-muted-foreground">{t('systemDescription')}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Sync & Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              {t('syncData')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('autoSync')}</Label>
                <p className="text-sm text-muted-foreground">{t('autoSyncDesc')}</p>
              </div>
              <Switch
                checked={system.autoSync}
                onCheckedChange={() => toggleSystem('autoSync')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>{t('offlineMode')}</Label>
                <p className="text-sm text-muted-foreground">{t('offlineModeDesc')}</p>
              </div>
              <Switch
                checked={system.offlineMode}
                onCheckedChange={() => toggleSystem('offlineMode')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>{t('autoBackup')}</Label>
                <p className="text-sm text-muted-foreground">{t('autoBackupDesc')}</p>
              </div>
              <Switch
                checked={system.autoBackup}
                onCheckedChange={() => toggleSystem('autoBackup')}
              />
            </div>

            <Separator />

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast.success(t('syncCompleted'))}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('syncNow')}
            </Button>
          </CardContent>
        </Card>

        {/* Storage Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              {t('storage')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Storage Overview */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('used')}</span>
                <span>{storage.used} MB / {storage.total} MB</span>
              </div>
              <Progress value={(storage.used / storage.total) * 100} className="h-2" />
            </div>

            {/* Storage Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">{t('documents')}</span>
                </div>
                <span className="text-sm text-muted-foreground">{storage.documents} MB</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">{t('cache')}</span>
                </div>
                <span className="text-sm text-muted-foreground">{storage.cache} MB</span>
              </div>
            </div>

            <Separator />

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleClearCache}
            >
              <Trash2 className="h-4 w-4 mr-2" />
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
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4 mr-2" />
              {t('exportData')}
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleImportData}
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('importData')}
            </Button>

            <Separator />

            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleFactoryReset}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('factoryReset')}
            </Button>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('advanced')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('debugMode')}</Label>
                <p className="text-sm text-muted-foreground">{t('debugModeDesc')}</p>
              </div>
              <Switch
                checked={system.debugMode}
                onCheckedChange={() => toggleSystem('debugMode')}
              />
            </div>

            <div>
              <Label className="text-sm">{t('cacheSize')}</Label>
              <Select 
                value={system.cacheSize} 
                onValueChange={(value) => setSystem(prev => ({ ...prev, cacheSize: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 MB</SelectItem>
                  <SelectItem value="250">250 MB</SelectItem>
                  <SelectItem value="500">500 MB</SelectItem>
                  <SelectItem value="1000">1 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {t('appInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">{t('version')}</span>
              <Badge variant="secondary">v1.0.0</Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">{t('buildDate')}</span>
              <span className="text-sm text-muted-foreground">2024-09-26</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">{t('lastSync')}</span>
              <span className="text-sm text-muted-foreground">{t('now')}</span>
            </div>

            <Separator />

            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              {t('privacyPolicy')}
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Info className="h-4 w-4 mr-2" />
              {t('termsOfService')}
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-4">
          <Button onClick={handleSave} className="w-full">
            {t('saveChanges')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileSystemSettings;