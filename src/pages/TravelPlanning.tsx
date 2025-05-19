import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Calculator, Map, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PremiumCheck from "@/components/premium/PremiumCheck";
import CommuteOptimizer from "@/components/travel/CommuteOptimizer";
import RideSharing from "@/components/travel/RideSharing";
import CommuteCostCalculator from "@/components/travel/CommuteCostCalculator";
import TrafficPredictions from "@/components/travel/TrafficPredictions";
import { useToast } from "@/hooks/use-toast";

const TravelPlanning = () => {
  const [activeTab, setActiveTab] = useState("optimizer");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Oznámit uživateli, že byla změněna záložka
    toast({
      title: "Záložka změněna",
      description: `Zobrazuji: ${getTabName(value)}`,
      duration: 2000
    });
  };

  const getTabName = (tabId: string): string => {
    switch (tabId) {
      case "optimizer": return "Optimalizace dojíždění";
      case "ridesharing": return "Sdílení jízd";
      case "calculator": return "Kalkulačka nákladů";
      case "predictions": return "Predikce dopravy";
      default: return "";
    }
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  return (
    <PremiumCheck featureKey="travel_planning">
      <div className="container py-8">
        <Helmet>
          <title>Plánování cest | Pendler Buddy</title>
        </Helmet>
        
        {/* Back button */}
        <Button 
          variant="outline" 
          onClick={handleNavigateBack} 
          className="mb-4"
        >
          Zpět
        </Button>
        
        {/* Header section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Map className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Personalizované plánování cest</h1>
          </div>
          
          <p className="text-muted-foreground text-lg max-w-3xl">
            Optimalizujte své každodenní dojíždění, ušetřete náklady a čas s našimi nástroji pro plánování cest.
            Přizpůsobte své cesty podle vašich směn a sdílejte jízdy s ostatními pendlery.
          </p>
        </section>
        
        {/* Main content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="w-full justify-start max-w-3xl overflow-x-auto">
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <Car className="h-4 w-4" /> Optimalizace dojíždění
            </TabsTrigger>
            <TabsTrigger value="ridesharing" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Sdílení jízd
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" /> Kalkulačka nákladů
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Predikce dopravy
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="optimizer">
            <CommuteOptimizer />
          </TabsContent>
          
          <TabsContent value="ridesharing">
            <RideSharing />
          </TabsContent>
          
          <TabsContent value="calculator">
            <CommuteCostCalculator />
          </TabsContent>
          
          <TabsContent value="predictions">
            <TrafficPredictions />
          </TabsContent>
        </Tabs>
      </div>
    </PremiumCheck>
  );
};

export default TravelPlanning;
