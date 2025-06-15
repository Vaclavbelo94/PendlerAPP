
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import { DashboardBackground } from '@/components/common/DashboardBackground';
import { SettingsNavigation } from '@/components/settings/SettingsNavigation';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { LanguageSettings } from '@/components/settings/LanguageSettings';
import { SyncSettings } from '@/components/settings/SyncSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';

const Settings = () => {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'appearance';
  });

  // All available settings tabs for swipe navigation
  const settingsTabs = ['appearance', 'language', 'sync', 'security', 'notifications', 'account'];

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab !== 'appearance') {
      setSearchParams({ tab: activeTab });
    } else {
      setSearchParams({});
    }
  }, [activeTab, setSearchParams]);

  // Update tab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  // Swipe navigation setup
  const { containerRef } = useSwipeNavigation({
    items: settingsTabs,
    currentItem: activeTab,
    onItemChange: setActiveTab,
    enabled: isMobile
  });

  const renderTabContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'appearance':
          return <AppearanceSettings />;
        case 'language':
          return <LanguageSettings />;
        case 'sync':
          return <SyncSettings />;
        case 'security':
          return <SecuritySettings />;
        case 'notifications':
          return <NotificationSettings />;
        case 'account':
          return <AccountSettings />;
        default:
          return <AppearanceSettings />;
      }
    })();

    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {content}
      </motion.div>
    );
  };

  return (
    <DashboardBackground variant="settings">
      <div className="container py-6 md:py-10 max-w-7xl">
        <div ref={containerRef} className="touch-manipulation swipe-container">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Nastavení aplikace</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Spravujte své preference a nastavení aplikace
            </p>
            {isMobile && (
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Přejeďte prstem doleva/doprava pro navigaci mezi záložkami
              </p>
            )}
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SettingsNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </motion.div>

            <div className="mt-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </DashboardBackground>
  );
};

export default Settings;
