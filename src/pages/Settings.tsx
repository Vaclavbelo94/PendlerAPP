
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings as SettingsIcon
} from 'lucide-react';
import ProfileAppearance from '@/components/profile/ProfileAppearance';
import GeneralSettings from '@/components/settings/GeneralSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import DataSettings from '@/components/settings/DataSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import DeviceSettings from '@/components/settings/DeviceSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import SettingsNavigation from '@/components/settings/SettingsNavigation';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  const { settings: syncSettings, saveSettings: updateSyncSettings } = useSyncSettings();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container py-6 md:py-10 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Nastavení aplikace</h1>
        </div>
        <p className="text-muted-foreground">
          Spravujte své preference a nastavení aplikace
        </p>
      </div>

      <div className="space-y-6">
        {/* Primary navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Hlavní nastavení</h3>
          <SettingsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="primary"
          />
        </div>

        {/* Secondary navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Další nastavení</h3>
          <SettingsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="secondary"
          />
        </div>

        {/* Tab content */}
        <div className="mt-8">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "appearance" && <ProfileAppearance />}
          {activeTab === "notifications" && (
            <NotificationSettings 
              syncSettings={syncSettings}
              updateSyncSettings={updateSyncSettings}
            />
          )}
          {activeTab === "language" && <LanguageSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "device" && <DeviceSettings />}
          {activeTab === "data" && <DataSettings />}
          {activeTab === "privacy" && <PrivacySettings />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
