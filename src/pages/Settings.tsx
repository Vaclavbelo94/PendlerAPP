
import React from 'react';
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
import { useSyncSettings } from '@/hooks/useSyncSettings';
import GeneralSettings from '@/components/settings/GeneralSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import DataSettings from '@/components/settings/DataSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';

const Settings = () => {
  const { settings: syncSettings, updateSettings: updateSyncSettings } = useSyncSettings();

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

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 max-w-full h-auto">
          <TabsTrigger value="general" className="flex flex-col items-center gap-1 py-3">
            <SettingsIcon className="h-4 w-4" />
            <span className="text-xs">Obecné</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex flex-col items-center gap-1 py-3">
            <User className="h-4 w-4" />
            <span className="text-xs">Účet</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex flex-col items-center gap-1 py-3">
            <Palette className="h-4 w-4" />
            <span className="text-xs">Vzhled</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 py-3">
            <Bell className="h-4 w-4" />
            <span className="text-xs">Oznámení</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex flex-col items-center gap-1 py-3">
            <Globe className="h-4 w-4" />
            <span className="text-xs">Jazyk</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex flex-col items-center gap-1 py-3">
            <Database className="h-4 w-4" />
            <span className="text-xs">Data</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex flex-col items-center gap-1 py-3">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Soukromí</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettings 
            syncSettings={syncSettings}
            updateSyncSettings={updateSyncSettings}
          />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <ProfileAppearance />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings 
            syncSettings={syncSettings}
            updateSyncSettings={updateSyncSettings}
          />
        </TabsContent>

        <TabsContent value="language" className="space-y-6">
          <LanguageSettings />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataSettings />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
