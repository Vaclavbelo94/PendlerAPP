
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAdminPanel } from './UserAdminPanel';
import { PremiumFeaturesPanel } from './PremiumFeaturesPanel';
import { RideshareAdminPanel } from './rideshare/RideshareAdminPanel';
import { PasswordResetPanel } from './PasswordResetPanel';
import { AdManagementPanel } from './AdManagementPanel';
import SecurityDashboard from './security/SecurityDashboard';

import DatabasePanel from './database/DatabasePanel';
import SystemMonitoringPanel from './monitoring/SystemMonitoringPanel';
import PerformanceDashboard from './analytics/PerformanceDashboard';
import { useTranslation } from 'react-i18next';

const AdminSections = () => {
  const { t } = useTranslation('admin');

  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid grid-cols-11 w-full">
        <TabsTrigger value="security">{t('tabs.security')}</TabsTrigger>
        <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
        <TabsTrigger value="premium">{t('tabs.premium')}</TabsTrigger>
        <TabsTrigger value="rideshare">{t('tabs.rideshare')}</TabsTrigger>
        <TabsTrigger value="promos">{t('tabs.promos')}</TabsTrigger>
        <TabsTrigger value="ads">{t('tabs.ads')}</TabsTrigger>
        <TabsTrigger value="passwords">{t('tabs.passwords')}</TabsTrigger>
        <TabsTrigger value="modules">{t('tabs.modules')}</TabsTrigger>
        <TabsTrigger value="database">{t('tabs.database')}</TabsTrigger>
        <TabsTrigger value="monitoring">{t('tabs.monitoring')}</TabsTrigger>
        <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <UserAdminPanel />
      </TabsContent>

      <TabsContent value="premium">
        <PremiumFeaturesPanel />
      </TabsContent>

      <TabsContent value="rideshare">
        <RideshareAdminPanel />
      </TabsContent>

      <TabsContent value="promos">
        
      </TabsContent>

      <TabsContent value="ads">
        <AdManagementPanel />
      </TabsContent>

      <TabsContent value="passwords">
        <PasswordResetPanel />
      </TabsContent>

      <TabsContent value="modules">
        <div className="p-4">{t('tabs.modulesMessage')}</div>
      </TabsContent>

      <TabsContent value="database">
        <DatabasePanel />
      </TabsContent>

      <TabsContent value="monitoring">
        <SystemMonitoringPanel />
      </TabsContent>

      <TabsContent value="analytics">
        <PerformanceDashboard />
      </TabsContent>

      <TabsContent value="security">
        <SecurityDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default AdminSections;
