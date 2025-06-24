
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Settings as SettingsIcon, User, Bell, Palette, Globe, Database, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useTranslation } from 'react-i18next';
import GeneralSettings from '../GeneralSettings';
import AccountSettings from '../AccountSettings';
import AppearanceSettings from '../AppearanceSettings';
import NotificationSettings from '../NotificationSettings';
import LanguageSettings from '../LanguageSettings';
import SecuritySettings from '../SecuritySettings';
import DeviceSettings from '../DeviceSettings';
import DataSettings from '../DataSettings';

interface SettingsMobileCarouselProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  syncSettings: any;
  updateSyncSettings: (settings: any) => void;
}

export const SettingsMobileCarousel: React.FC<SettingsMobileCarouselProps> = ({
  activeTab,
  onTabChange,
  syncSettings,
  updateSyncSettings
}) => {
  const { t } = useTranslation('settings');
  
  const tabs = [
    { id: 'general', label: t('general'), icon: SettingsIcon },
    { id: 'account', label: t('account'), icon: User },
    { id: 'appearance', label: t('appearance'), icon: Palette },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'language', label: t('language'), icon: Globe },
    { id: 'security', label: t('security'), icon: Shield },
    { id: 'device', label: t('device'), icon: Smartphone },
    { id: 'data', label: t('data'), icon: Database }
  ];

  const tabIds = tabs.map(tab => tab.id);
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

  const { containerRef } = useSwipeNavigation({
    items: tabIds,
    currentItem: activeTab,
    onItemChange: onTabChange,
    enabled: true
  });

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    onTabChange(tabs[prevIndex].id);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % tabs.length;
    onTabChange(tabs[nextIndex].id);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'account':
        return <AccountSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return <NotificationSettings syncSettings={syncSettings} updateSyncSettings={updateSyncSettings} />;
      case 'language':
        return <LanguageSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'device':
        return <DeviceSettings />;
      case 'data':
        return <DataSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  const currentTab = tabs[currentIndex];
  const Icon = currentTab?.icon || SettingsIcon;

  return (
    <div className="space-y-4">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          disabled={tabs.length <= 1}
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {currentTab?.label}
            </h2>
          </div>
          <div className="flex justify-center space-x-1">
            {tabs.map((_, index) => (
              <button
                key={index}
                onClick={() => onTabChange(tabs[index].id)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          disabled={tabs.length <= 1}
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Tab Content with Animation */}
      <div ref={containerRef} className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tab info */}
      <div className="text-center text-sm text-white/70 px-4">
        {currentIndex + 1} z {tabs.length} • {currentTab?.label}
      </div>
    </div>
  );
};

export default SettingsMobileCarousel;
