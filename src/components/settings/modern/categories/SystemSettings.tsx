import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Trash2, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SettingItem from '../SettingItem';
import { toast } from 'sonner';

interface SystemSettingsProps {
  onBack: () => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleClearCache = () => {
    // TODO: Implement cache clearing
    toast.success(t('cacheCleared'));
  };

  const handleExportData = () => {
    // TODO: Implement data export
    toast.info(t('dataExportNotImplemented'));
  };

  const handleSync = () => {
    // TODO: Implement manual sync
    toast.success(t('syncCompleted'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold">{t('system')}</h2>
        </div>

        <div className="space-y-6">
          {/* Synchronization */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('synchronization')}</h3>
            <div className="space-y-4">
              <SettingItem
                title={t('autoSync')}
                description={t('autoSyncDescription')}
                type="toggle"
                value={autoSync}
                onChange={setAutoSync}
              />
              <SettingItem
                title={t('manualSync')}
                description={t('manualSyncDescription')}
                type="button"
                onClick={handleSync}
              />
            </div>
          </Card>

          {/* Offline Mode */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('offlineMode')}</h3>
            <SettingItem
              title={t('enableOfflineMode')}
              description={t('offlineModeDescription')}
              type="toggle"
              value={offlineMode}
              onChange={setOfflineMode}
            />
          </Card>

          {/* Data Management */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('dataManagement')}</h3>
            <div className="space-y-4">
              <SettingItem
                title={t('exportData')}
                description={t('exportDataDescription')}
                type="button"
                onClick={handleExportData}
              />
              <SettingItem
                title={t('clearCache')}
                description={t('clearCacheDescription')}
                type="button"
                onClick={handleClearCache}
              />
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemSettings;