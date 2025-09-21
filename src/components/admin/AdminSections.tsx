
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

const AdminSections = () => {
  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid grid-cols-11 w-full">
        <TabsTrigger value="security">Bezpečnost</TabsTrigger>
        <TabsTrigger value="users">Uživatelé</TabsTrigger>
        <TabsTrigger value="premium">Premium</TabsTrigger>
        <TabsTrigger value="rideshare">Spolujízdy</TabsTrigger>
        <TabsTrigger value="promos">Promo kódy</TabsTrigger>
        <TabsTrigger value="ads">Reklamy</TabsTrigger>
        <TabsTrigger value="passwords">Hesla</TabsTrigger>
        <TabsTrigger value="modules">Moduly</TabsTrigger>
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
        <div className="p-4">Company modules management moved to new Admin V2</div>
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
