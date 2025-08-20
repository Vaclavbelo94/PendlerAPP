import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/components/theme-provider';
import SettingItem from '../SettingItem';
import { toast } from 'sonner';

interface AppearanceSettingsProps {
  onBack: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ onBack }) => {
  const { t } = useTranslation('settings');
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState('medium');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  const themeOptions = [
    { value: 'light', label: t('lightMode') },
    { value: 'dark', label: t('darkMode') },
    { value: 'system', label: t('systemMode') }
  ];

  const fontSizeOptions = [
    { value: 'small', label: t('fontSmall') },
    { value: 'medium', label: t('fontMedium') },
    { value: 'large', label: t('fontLarge') }
  ];

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    toast.success(t('themeChanged'));
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    // TODO: Implement font size change
    toast.info(t('fontSizeNotImplemented'));
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
          <h2 className="text-2xl font-semibold">{t('appearance')}</h2>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('theme')}</h3>
            <SettingItem
              title={t('colorMode')}
              description={t('themeDescription')}
              type="select"
              value={theme}
              onChange={handleThemeChange}
              options={themeOptions}
            />
          </Card>

          {/* Display Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('display')}</h3>
            <div className="space-y-4">
              <SettingItem
                title={t('fontSize')}
                description={t('fontSizeDescription')}
                type="select"
                value={fontSize}
                onChange={handleFontSizeChange}
                options={fontSizeOptions}
              />
              <SettingItem
                title={t('compactMode')}
                description={t('compactModeDescription')}
                type="toggle"
                value={compactMode}
                onChange={setCompactMode}
              />
              <SettingItem
                title={t('animations')}
                description={t('animationsDescription')}
                type="toggle"
                value={animations}
                onChange={setAnimations}
              />
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AppearanceSettings;