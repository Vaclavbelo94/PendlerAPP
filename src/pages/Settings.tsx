
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import ProfileErrorBoundary from '@/components/profile/ProfileErrorBoundary';
import GeneralSettings from '@/components/settings/GeneralSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import DataSettings from '@/components/settings/DataSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import DeviceSettings from '@/components/settings/DeviceSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import SettingsMobileCarousel from '@/components/settings/mobile/SettingsMobileCarousel';
import ModernSettingsNavigation from '@/components/settings/ModernSettingsNavigation';
import DashboardBackground from '@/components/common/DashboardBackground';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { settings: syncSettings, saveSettings: updateSyncSettings } = useSyncSettings();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("general");
  const { t } = useTranslation('settings');

  // All available settings tabs for swipe navigation
  const allSettingsTabs = [
    "general", "account", "appearance", "notifications", 
    "language", "security", "device", "data"
  ];

  // Swipe navigation setup
  const { containerRef } = useSwipeNavigation({
    items: allSettingsTabs,
    currentItem: activeTab,
    onItemChange: setActiveTab,
    enabled: isMobile
  });

  const renderDesktopContent = () => {
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

  return (
    <>
      <Helmet>
        <title>{t('title')} | PendlerApp</title>
        <meta name="description" content={t('title')} />
      </Helmet>
      
      <DashboardBackground variant="default">
        <div className="container mx-auto px-4 py-8">
          {/* Header section with dashboard-style animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
              <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full bg-white/10 backdrop-blur-sm border border-white/20`}>
                <SettingsIcon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
              </div>
              <div>
                <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight text-white`}>
                  {t('title')}
                </h1>
                <p className={`text-white/80 ${isMobile ? 'text-sm mt-2' : 'text-lg mt-2'} max-w-3xl`}>
                  {isMobile 
                    ? t('basicSettings') 
                    : t('applicationBehavior')
                  }
                </p>
              </div>
            </div>
            {isMobile && (
              <p className="text-xs text-white/60 text-center px-4">
                💡 {t('swipeNavigationTip')}
              </p>
            )}
          </motion.div>

          <ProfileErrorBoundary>
            {/* Mobile: Swipe Carousel */}
            {isMobile ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                ref={containerRef}
              >
                <SettingsMobileCarousel
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  syncSettings={syncSettings}
                  updateSyncSettings={updateSyncSettings}
                />
              </motion.div>
            ) : (
              /* Desktop: Traditional Navigation + Content */
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <ModernSettingsNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8"
                >
                  {renderDesktopContent()}
                </motion.div>
              </>
            )}
          </ProfileErrorBoundary>
        </div>
      </DashboardBackground>
    </>
  );
};

export default Settings;
