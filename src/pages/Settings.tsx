
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Database,
  Shield,
  Smartphone
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
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  const { settings: syncSettings, updateSettings: updateSyncSettings } = useSyncSettings();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("general");

  const primaryTabs = [
    { id: "general", label: "Obecné", icon: SettingsIcon },
    { id: "account", label: "Účet", icon: User },
    { id: "appearance", label: "Vzhled", icon: Palette },
    { id: "notifications", label: isMobile ? "Notif" : "Oznámení", icon: Bell }
  ];

  const secondaryTabs = [
    { id: "language", label: "Jazyk", icon: Globe },
    { id: "security", label: "Bezpečnost", icon: Shield },
    { id: "device", label: "Zařízení", icon: Smartphone },
    { id: "data", label: "Data", icon: Database }
  ];

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
        {/* Primary tabs for mobile and desktop */}
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 p-4 rounded-lg border transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card hover:bg-accent'
                } ${isMobile ? 'flex-col text-center' : ''}`}
              >
                <Icon className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary tabs */}
        <div>
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">Další nastavení</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {secondaryTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card hover:bg-accent'
                  } ${isMobile ? 'justify-center' : 'justify-start'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-6">
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
        </div>
      </div>
    </div>
  );
};

export default Settings;
