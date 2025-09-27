import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Palette, Bell, Settings as SettingsIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import MobileProfileTab from './tabs/MobileProfileTab';
import MobileAppearanceTab from './tabs/MobileAppearanceTab';
import MobileNotificationTab from './tabs/MobileNotificationTab';
import MobileSystemTab from './tabs/MobileSystemTab';

const MobileSettingsLayout = () => {
  const { t } = useTranslation('settings');
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-20 p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground mb-1">
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        {/* Tab Navigation */}
        <div className="sticky top-[5rem] bg-background/95 backdrop-blur-sm border-b border-border z-10">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 m-2 bg-muted/50 rounded-lg">
            <TabsTrigger 
              value="profile" 
              className="flex flex-col gap-1 h-14 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <User className="h-4 w-4" />
              <span className="text-xs font-medium">{t('profile')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="flex flex-col gap-1 h-14 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <Palette className="h-4 w-4" />
              <span className="text-xs font-medium">{t('appearance')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex flex-col gap-1 h-14 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <Bell className="h-4 w-4" />
              <span className="text-xs font-medium">{t('notifications')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="flex flex-col gap-1 h-14 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
            >
              <SettingsIcon className="h-4 w-4" />
              <span className="text-xs font-medium">{t('system')}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <TabsContent value="profile" className="m-0 h-full">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <MobileProfileTab />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="appearance" className="m-0 h-full">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <MobileAppearanceTab />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="notifications" className="m-0 h-full">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <MobileNotificationTab />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="system" className="m-0 h-full">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <MobileSystemTab />
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MobileSettingsLayout;