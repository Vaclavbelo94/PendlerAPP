
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Zap, Target, Settings } from 'lucide-react';
import PromoCodeAnalyticsDashboard from './analytics/PromoCodeAnalyticsDashboard';
import BulkPromoCodeGenerator from './generation/BulkPromoCodeGenerator';
import PromoCampaignManager from './campaigns/PromoCampaignManager';

const PromoCodeManagementHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Promo Code Management Hub</h1>
        <p className="text-muted-foreground mt-2">
          Kompletní řízení promo kódů, analýzy a kampaní
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Bulk generátor
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Kampaně
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Nastavení
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <PromoCodeAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <BulkPromoCodeGenerator />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <PromoCampaignManager />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nastavení promo kódů</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nastavení systému promo kódů bude implementováno v další fázi.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromoCodeManagementHub;
