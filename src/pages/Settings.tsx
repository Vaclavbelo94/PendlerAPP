
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings as SettingsIcon
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProfileErrorBoundary from '@/components/profile/ProfileErrorBoundary';
import GeneralSettings from '@/components/settings/GeneralSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import DataSettings from '@/components/settings/DataSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import DeviceSettings from '@/components/settings/DeviceSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import ProfileAppearance from '@/components/profile/ProfileAppearance';
import { UniversalMobileNavigation } from '@/components/navigation/UniversalMobileNavigation';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { DashboardBackground } from '@/components/common/DashboardBackground';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Globe, 
  Database,
  Shield,
  Smartphone,
  Palette,
  Lock
} from 'lucide-react';

const Settings = () => {
  const { settings: syncSettings, saveSettings: updateSyncSettings } = useSyncSettings();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || "general";
  });

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab !== "general") {
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

  // All available settings tabs for swipe navigation
  const allSettingsTabs = [
    "general", "account", "appearance", "notifications", 
    "language", "security", "device", "data", "privacy"
  ];

  // Settings tabs configuration for UniversalMobileNavigation
  const settingsTabs = [
    {
      id: 'general',
      icon: SettingsIcon,
      label: 'Obecné',
      description: 'Základní nastavení aplikace'
    },
    {
      id: 'account',
      icon: User,
      label: 'Účet',
      description: 'Správa uživatelského účtu'
    },
    {
      id: 'appearance',
      icon: Palette,
      label: 'Vzhled',
      description: 'Témata a zobrazení'
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Oznámení',
      description: 'Nastavení upozornění'
    },
    {
      id: 'language',
      icon: Globe,
      label: 'Jazyk',
      description: 'Jazykové preference'
    },
    {
      id: 'security',
      icon: Lock,
      label: 'Bezpečnost',
      description: 'Zabezpečení a soukromí'
    },
    {
      id: 'device',
      icon: Smartphone,
      label: 'Zařízení',
      description: 'Nastavení zařízení'
    },
    {
      id: 'data',
      icon: Database,
      label: 'Data',
      description: 'Správa dat a zálohy'
    },
    {
      id: 'privacy',
      icon: Shield,
      label: 'Soukromí',
      description: 'Ochrana soukromí'
    }
  ];

  // Swipe navigation setup
  const { containerRef } = useSwipeNavigation({
    items: allSettingsTabs,
    currentItem: activeTab,
    onItemChange: setActiveTab,
    enabled: isMobile
  });

  const renderTabContent = () => {
    const content = (() => {
      switch (activeTab) {
        case "general":
          return <GeneralSettings />;
        case "account":
          return <AccountSettings />;
        case "appearance":
          return <ProfileAppearance />;
        case "notifications":
          return <NotificationSettings 
            syncSettings={syncSettings}
            updateSyncSettings={updateSyncSettings}
          />;
        case "language":
          return <LanguageSettings />;
        case "security":
          return <SecuritySettings />;
        case "device":
          return <DeviceSettings />;
        case "data":
          return <DataSettings />;
        case "privacy":
          return <PrivacySettings />;
        default:
          return <GeneralSettings />;
      }
    })();

    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ProfileErrorBoundary>
          {content}
        </ProfileErrorBoundary>
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

          <ProfileErrorBoundary>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <UniversalMobileNavigation
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  tabs={settingsTabs}
                  className="settings-navigation"
                />
              </motion.div>

              <div className="mt-8">
                {renderTabContent()}
              </div>
            </div>
          </ProfileErrorBoundary>
        </div>
      </div>
    </DashboardBackground>
  );
};

export default Settings;
