
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings as SettingsIcon
} from 'lucide-react';
import ProfileAppearance from '@/components/profile/ProfileAppearance';
import ProfileErrorBoundary from '@/components/profile/ProfileErrorBoundary';
import GeneralSettings from '@/components/settings/GeneralSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import DataSettings from '@/components/settings/DataSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import DeviceSettings from '@/components/settings/DeviceSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import { UniversalMobileNavigation } from '@/components/navigation/UniversalMobileNavigation';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Database,
  Shield,
  Smartphone
} from 'lucide-react';

const Settings = () => {
  const { settings: syncSettings, saveSettings: updateSyncSettings } = useSyncSettings();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("general");

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
      icon: Shield,
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

  // Debug logging
  console.log('Settings: Rendering with activeTab:', activeTab);

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div ref={containerRef} className="touch-manipulation swipe-container">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Nastavení aplikace</h1>
          </div>
          <p className="text-muted-foreground">
            Spravujte své preference a nastavení aplikace
          </p>
          {isMobile && (
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tip: Přejeďte prstem doleva/doprava pro navigaci mezi záložkami
            </p>
          )}
        </div>

        <ProfileErrorBoundary>
          <div className="space-y-6">
            {/* Unified navigation using UniversalMobileNavigation */}
            <UniversalMobileNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={settingsTabs}
              className="settings-navigation"
            />

            {/* Tab content with individual error boundaries */}
            <div className="mt-8">
              {activeTab === "general" && (
                <ProfileErrorBoundary>
                  <GeneralSettings />
                </ProfileErrorBoundary>
              )}
              {activeTab === "account" && (
                <ProfileErrorBoundary>
                  <AccountSettings />
                </ProfileErrorBoundary>
              )}
              {activeTab === "appearance" && (
                <ProfileErrorBoundary>
                  <ProfileAppearance />
                </ProfileErrorBoundary>
              )}
              {activeTab === "notifications" && (
                <ProfileErrorBoundary>
                  <NotificationSettings 
                    syncSettings={syncSettings}
                    updateSyncSettings={updateSyncSettings}
                  />
                </ProfileErrorBoundary>
              )}
              {activeTab === "language" && (
                <ProfileErrorBoundary>
                  <LanguageSettings />
                </ProfileErrorBoundary>
              )}
              {activeTab === "security" && (
                <ProfileErrorBoundary>
                  <SecuritySettings />
                </ProfileErrorBoundary>
              )}
              {activeTab === "device" && (
                <ProfileErrorBoundary>
                  <DeviceSettings />
                </ProfileErrorBoundary>
              )}
              {activeTab === "data" && (
                <ProfileErrorBoundary>
                  <DataSettings />
                </ProfileErrorBoundary>
              )}
              {activeTab === "privacy" && (
                <ProfileErrorBoundary>
                  <PrivacySettings />
                </ProfileErrorBoundary>
              )}
            </div>
          </div>
        </ProfileErrorBoundary>
      </div>
    </div>
  );
};

export default Settings;
