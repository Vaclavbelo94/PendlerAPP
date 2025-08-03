import React from 'react';
import { motion } from 'framer-motion';
import { SyncSettings } from '@/hooks/useSyncSettings';
import ModernGeneralSettings from './settings/ModernGeneralSettings';
import ModernAccountSettings from './settings/ModernAccountSettings';
import ModernAppearanceSettings from './settings/ModernAppearanceSettings';
import ModernNotificationSettings from './settings/ModernNotificationSettings';
import LanguageSettings from '../LanguageSettings';
import DataSettings from '../DataSettings';
import SecuritySettings from '../SecuritySettings';
import DeviceSettings from '../DeviceSettings';
import ModernShiftsSettings from './settings/ModernShiftsSettings';
import ModernAutomationSettings from './settings/ModernAutomationSettings';
import PrivacySettings from '../PrivacySettings';

interface ModernSettingsDetailProps {
  settingId: string;
  syncSettings: SyncSettings;
  updateSyncSettings: (settings: Partial<SyncSettings>) => Promise<boolean>;
}

const ModernSettingsDetail: React.FC<ModernSettingsDetailProps> = ({
  settingId,
  syncSettings,
  updateSyncSettings
}) => {
  const renderSetting = () => {
    switch (settingId) {
      case 'general':
        return <ModernGeneralSettings />;
      case 'account':
        return <ModernAccountSettings />;
      case 'appearance':
        return <ModernAppearanceSettings />;
      case 'notifications':
        return <ModernNotificationSettings syncSettings={syncSettings} updateSyncSettings={updateSyncSettings} />;
      case 'language':
        return <LanguageSettings />;
      case 'shifts':
        return <ModernShiftsSettings />;
      case 'automation':
        return <ModernAutomationSettings />;
      case 'reports':
        return <ModernAutomationSettings />;
      case 'data':
        return <DataSettings />;
      case 'sync':
        return <DataSettings />;
      case 'export':
        return <DataSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'sessions':
        return <SecuritySettings />;
      case 'device':
        return <DeviceSettings />;
      case 'advanced':
        return <DeviceSettings />;
      case 'analytics':
        return <DataSettings />;
      default:
        return <ModernGeneralSettings />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto p-4"
    >
      {renderSetting()}
    </motion.div>
  );
};

export default ModernSettingsDetail;