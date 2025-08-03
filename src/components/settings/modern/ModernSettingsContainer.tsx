import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import ModernSettingsGrid from './ModernSettingsGrid';
import ModernSettingsDetail from './ModernSettingsDetail';
import { useSyncSettings } from '@/hooks/useSyncSettings';

export interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  color: string;
  badge?: string;
}

const ModernSettingsContainer = () => {
  const { t } = useTranslation('settings');
  const isMobile = useIsMobile();
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { settings: syncSettings, saveSettings: updateSyncSettings } = useSyncSettings();

  const handleBack = () => {
    setSelectedSetting(null);
  };

  const handleSettingSelect = (settingId: string) => {
    setSelectedSetting(settingId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <AnimatePresence mode="wait">
          {selectedSetting ? (
            <motion.div
              key="detail-header"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm"
            >
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold truncate">
                {t('settings')}
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="grid-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4 border-b border-border/50 bg-background/80 backdrop-blur-sm"
            >
              <div>
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {t('applicationBehavior')}
                </p>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hledat v nastavení..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedSetting ? (
            <ModernSettingsDetail
              key={selectedSetting}
              settingId={selectedSetting}
              syncSettings={syncSettings}
              updateSyncSettings={updateSyncSettings}
            />
          ) : (
            <ModernSettingsGrid
              key="grid"
              searchQuery={searchQuery}
              onSettingSelect={handleSettingSelect}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernSettingsContainer;