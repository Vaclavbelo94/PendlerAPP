import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, Monitor, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserSettings } from '@/hooks/useUserSettings';
import SettingItem from '../SettingItem';

interface AppearanceSettingsProps {
  onBack: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  const { settings, updateSetting, isSaving } = useUserSettings();

  const themeOptions = [
    { value: 'light', label: t('light') },
    { value: 'dark', label: t('dark') },
    { value: 'system', label: t('system') }
  ];

  const fontSizeOptions = [
    { value: 'small', label: t('small') },
    { value: 'medium', label: t('medium') },
    { value: 'large', label: t('large') }
  ];

  const colorSchemeOptions = [
    { value: 'purple', label: t('purple') },
    { value: 'blue', label: t('blue') },
    { value: 'green', label: t('green') },
    { value: 'orange', label: t('orange') }
  ];

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
          <h2 className="text-2xl font-semibold">{t('appearance')}</h2>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('theme')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('theme')}
                description={t('themeDescription')}
                type="select"
                value={settings.theme}
                onChange={(value) => handleSettingChange('theme', value)}
                options={themeOptions}
                disabled={isSaving}
              />
              
              <SettingItem
                title={t('colorScheme')}
                description={t('colorSchemeDescription')}
                type="select"
                value={settings.color_scheme}
                onChange={(value) => handleSettingChange('color_scheme', value)}
                options={colorSchemeOptions}
                disabled={isSaving}
              />
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('display')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('fontSize')}
                description={t('fontSizeDescription')}
                type="select"
                value={settings.font_size}
                onChange={(value) => handleSettingChange('font_size', value)}
                options={fontSizeOptions}
                disabled={isSaving}
              />
              
              <SettingItem
                title={t('compactMode')}
                description={t('compactModeDescription')}
                type="toggle"
                value={settings.compact_mode}
                onChange={(value) => handleSettingChange('compact_mode', value)}
                disabled={isSaving}
              />
              
              <SettingItem
                title={t('animations')}
                description={t('animationsDescription')}
                type="toggle"
                value={settings.animations_enabled}
                onChange={(value) => handleSettingChange('animations_enabled', value)}
                disabled={isSaving}
              />
            </div>
          </Card>

          {/* Accessibility Settings */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">{t('accessibility')}</h3>
            </div>
            
            <div className="space-y-0">
              <SettingItem
                title={t('highContrast')}
                description={t('highContrastDescription')}
                type="toggle"
                value={settings.high_contrast}
                onChange={(value) => handleSettingChange('high_contrast', value)}
                disabled={isSaving}
              />
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AppearanceSettings;