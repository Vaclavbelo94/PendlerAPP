import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Download, Trash2, Wifi } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import SettingItem from '../SettingItem';

interface SystemSettingsProps {
  onBack: () => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  const { settings, updateSetting, isSaving } = useUserSettings();
  const { updateLastSyncTime } = useSyncSettings();

  const handleClearCache = async () => {
    try {
      // Clear localStorage cache
      const keysToKeep = ['app_language', 'vite-ui-theme'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key) && !key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      toast.success(t('cacheCleared'));
    } catch (error) {
      toast.error('Nepodařilo se vymazat cache');
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = {
        settings,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `pendlerapp-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success(t('dataExported'));
    } catch (error) {
      toast.error('Nepodařilo se exportovat data');
    }
  };

  const handleManualSync = async () => {
    try {
      await updateLastSyncTime();
      toast.success(t('syncCompleted'));
    } catch (error) {
      toast.error('Synchronizace se nezdařila');
    }
  };

  const handleSettingChange = async (key: keyof typeof settings, value: any) => {
    const success = await updateSetting(key, value);
    if (success) {
      toast.success(t('settingsSaved'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-semibold">{t('system')}</h2>
        </div>

        <div className="space-y-6">
          {/* Synchronization */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('synchronization')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('autoSync')}
                description={t('autoSyncDescription')}
                type="toggle"
                value={settings.auto_sync}
                onChange={(value) => handleSettingChange('auto_sync', value)}
                disabled={isSaving}
              />
              
              <SettingItem
                title={t('manualSync')}
                description={t('manualSyncDescription')}
                type="button"
                onClick={handleManualSync}
                disabled={isSaving}
              />
            </div>
          </Card>

          {/* Offline Mode */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wifi className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('offlineMode')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('offlineMode')}
                description={t('offlineModeDescription')}
                type="toggle"
                value={settings.offline_mode}
                onChange={(value) => handleSettingChange('offline_mode', value)}
                disabled={isSaving}
              />
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('dataManagement')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('exportData')}
                description={t('exportDataDescription')}
                type="button"
                onClick={handleExportData}
                disabled={isSaving}
              />
              
              <SettingItem
                title={t('clearCache')}
                description={t('clearCacheDescription')}
                type="button"
                onClick={handleClearCache}
                disabled={isSaving}
              />
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemSettings;