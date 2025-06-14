
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import InsuranceCard from './InsuranceCard';
import InspectionCard from './InspectionCard';
import VignetteCard from './VignetteCard';
import DocumentsCard from './DocumentsCard';

interface OthersCardProps {
  vehicleId: string;
  fullView?: boolean;
}

const OthersCard: React.FC<OthersCardProps> = ({ vehicleId, fullView = false }) => {
  const [activeTab, setActiveTab] = useState("insurance");

  if (!fullView) {
    // Přehledové zobrazení - ukáže počet záznamů v každé kategorii
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ostatní
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Pojištění</p>
              <p className="text-lg font-bold">-</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">STK</p>
              <p className="text-lg font-bold">-</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Dálniční známky</p>
              <p className="text-lg font-bold">-</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <p className="text-sm text-muted-foreground">Dokumenty</p>
              <p className="text-lg font-bold">-</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Plné zobrazení s tabs
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Ostatní
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insurance">Pojištění</TabsTrigger>
            <TabsTrigger value="inspection">STK</TabsTrigger>
            <TabsTrigger value="vignette">Dálniční známky</TabsTrigger>
            <TabsTrigger value="documents">Dokumenty</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="insurance" className="mt-0">
              <InsuranceCard vehicleId={vehicleId} fullView />
            </TabsContent>
            
            <TabsContent value="inspection" className="mt-0">
              <InspectionCard vehicleId={vehicleId} fullView />
            </TabsContent>
            
            <TabsContent value="vignette" className="mt-0">
              <VignetteCard vehicleId={vehicleId} fullView />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-0">
              <DocumentsCard vehicleId={vehicleId} fullView />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OthersCard;
