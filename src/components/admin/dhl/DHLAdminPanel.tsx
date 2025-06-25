
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Calendar, FileSpreadsheet } from 'lucide-react';
import DHLPositionsManagement from './DHLPositionsManagement';
import DHLWorkGroupsManagement from './DHLWorkGroupsManagement';
import DHLShiftTemplatesManagement from './DHLShiftTemplatesManagement';
import DHLBulkImport from './DHLBulkImport';
import DHLSystemStats from './DHLSystemStats';

const DHLAdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-yellow-600" />
        <div>
          <h1 className="text-3xl font-bold">DHL Administrace</h1>
          <p className="text-muted-foreground">
            Správa pozic, pracovních skupin a šablon směn pro DHL systém
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="positions">Pozice</TabsTrigger>
          <TabsTrigger value="work-groups">Skupiny</TabsTrigger>
          <TabsTrigger value="templates">Šablony</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DHLSystemStats />
        </TabsContent>

        <TabsContent value="positions">
          <DHLPositionsManagement />
        </TabsContent>

        <TabsContent value="work-groups">
          <DHLWorkGroupsManagement />
        </TabsContent>

        <TabsContent value="templates">
          <DHLShiftTemplatesManagement />
        </TabsContent>

        <TabsContent value="import">
          <DHLBulkImport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DHLAdminPanel;
