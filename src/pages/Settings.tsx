
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
        <TabsList className={`grid h-auto p-1 ${
          isMobile 
            ? 'grid-cols-4 w-full' 
            : 'grid-cols-8 max-w-full'
        }`}>
          <TabsTrigger 
            value="general" 
            className={`flex items-center gap-1 ${
              isMobile 
                ? 'flex-col py-2 px-1 text-xs' 
                : 'flex-row py-3 px-3'
            }`}
          >
            <SettingsIcon className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            <span className={isMobile ? "text-[10px] leading-tight" : "text-xs"}>
              {isMobile ? "Obecné" : "Obecné"}
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="account" 
            className={`flex items-center gap-1 ${
              isMobile 
                ? 'flex-col py-2 px-1 text-xs' 
                : 'flex-row py-3 px-3'
            }`}
          >
            <User className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            <span className={isMobile ? "text-[10px] leading-tight" : "text-xs"}>
              Účet
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="appearance" 
            className={`flex items-center gap-1 ${
              isMobile 
                ? 'flex-col py-2 px-1 text-xs' 
                : 'flex-row py-3 px-3'
            }`}
          >
            <Palette className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            <span className={isMobile ? "text-[10px] leading-tight" : "text-xs"}>
              Vzhled
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="notifications" 
            className={`flex items-center gap-1 ${
              isMobile 
                ? 'flex-col py-2 px-1 text-xs' 
                : 'flex-row py-3 px-3'
            }`}
          >
            <Bell className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            <span className={isMobile ? "text-[10px] leading-tight" : "text-xs"}>
              {isMobile ? "Notif" : "Oznámení"}
            </span>
          </TabsTrigger>
          
          {!isMobile && (
            <>
              <TabsTrigger value="language" className="flex items-center gap-1 py-3 px-3">
                <Globe className="h-4 w-4" />
                <span className="text-xs">Jazyk</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1 py-3 px-3">
                <Shield className="h-4 w-4" />
                <span className="text-xs">Bezpečnost</span>
              </TabsTrigger>
              <TabsTrigger value="device" className="flex items-center gap-1 py-3 px-3">
                <Smartphone className="h-4 w-4" />
                <span className="text-xs">Zařízení</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-1 py-3 px-3">
                <Database className="h-4 w-4" />
                <span className="text-xs">Data</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Mobile secondary tabs for hidden options */}
        {isMobile && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Další nastavení</h3>
            <div className="grid grid-cols-2 gap-2">
              <TabsTrigger 
                value="language" 
                className="flex items-center gap-2 py-3 px-3 justify-start h-auto"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">Jazyk</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="security" 
                className="flex items-center gap-2 py-3 px-3 justify-start h-auto"
              >
                <Shield className="h-4 w-4" />
                <span className="text-sm">Bezpečnost</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="device" 
                className="flex items-center gap-2 py-3 px-3 justify-start h-auto"
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-sm">Zařízení</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="data" 
                className="flex items-center gap-2 py-3 px-3 justify-start h-auto"
              >
                <Database className="h-4 w-4" />
                <span className="text-sm">Data</span>
              </TabsTrigger>
            </div>
          </div>
        )}

        <TabsContent value="general" className="space-y-6">
          <GeneralSettings />
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

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="device" className="space-y-6">
          <DeviceSettings />
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <DataSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
