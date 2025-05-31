
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserAdminPanel from './UserAdminPanel';
import PremiumFeaturesPanel from './PremiumFeaturesPanel';
import PromoCodesPanel from './PromoCodesPanel';
import PasswordResetPanel from './PasswordResetPanel';
import DatabasePanel from './database/DatabasePanel';
import SystemMonitoringPanel from './monitoring/SystemMonitoringPanel';
import PerformanceDashboard from './analytics/PerformanceDashboard';

const AdminSections = () => {
  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid grid-cols-7 w-full">
        <TabsTrigger value="users">Uživatelé</TabsTrigger>
        <TabsTrigger value="premium">Premium</TabsTrigger>
        <TabsTrigger value="promos">Promo kódy</TabsTrigger>
        <TabsTrigger value="passwords">Hesla</TabsTrigger>
        <TabsTrigger value="database">Databáze</TabsTrigger>
        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <UserAdminPanel />
      </TabsContent>

      <TabsContent value="premium">
        <PremiumFeaturesPanel />
      </TabsContent>

      <TabsContent value="promos">
        <PromoCodesPanel />
      </TabsContent>

      <TabsContent value="passwords">
        <PasswordResetPanel />
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
    </Tabs>
  );
};

export default AdminSections;
