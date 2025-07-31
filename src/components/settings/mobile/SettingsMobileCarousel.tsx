
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
      <div className="flex items-center justify-between px-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          disabled={tabs.length <= 1}
          className="h-10 w-10 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 shadow-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 text-center px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white drop-shadow-md">
                {currentTab?.label}
              </h2>
            </div>
            <div className="flex justify-center space-x-2">
              {tabs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onTabChange(tabs[index].id)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-white shadow-lg scale-110' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          disabled={tabs.length <= 1}
          className="h-10 w-10 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 shadow-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Tab Content with Animation */}
      <div ref={containerRef} className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="bg-card backdrop-blur-sm rounded-xl border border-border p-4 shadow-xl"
          >
            <div className="relative z-10">
              {renderTabContent()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tab info */}
      <div className="text-center text-sm text-white/80 px-4 mt-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 inline-block">
          <span className="font-medium">{currentIndex + 1}</span>
          <span className="mx-2 text-white/60">z</span>
          <span className="font-medium">{tabs.length}</span>
          <span className="mx-2 text-white/60">•</span>
          <span className="text-white/90">{currentTab?.label}</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsMobileCarousel;
