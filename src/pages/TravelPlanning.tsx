
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Calculator, Map, Users, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PremiumCheck from "@/components/premium/PremiumCheck";
import CommuteOptimizer from "@/components/travel/CommuteOptimizer";
import RideSharing from "@/components/travel/RideSharing";
import CommuteCostCalculator from "@/components/travel/CommuteCostCalculator";
import TrafficPredictions from "@/components/travel/TrafficPredictions";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const TravelPlanning = () => {
  const [activeTab, setActiveTab] = useState("optimizer");
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
      <div className={`${isMobile ? 'px-3 py-3' : 'max-w-7xl mx-auto px-4 py-8'}`}>
        <Helmet>
          <title>Plánování cest | Pendler Buddy</title>
        </Helmet>
        
        {/* Back button - mobilní optimalizace */}
        <Button 
          variant="outline" 
          onClick={handleNavigateBack} 
          className={`mb-4 ${isMobile ? 'h-8 px-2' : ''}`}
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
          {isMobile ? 'Zpět' : 'Zpět'}
        </Button>
        
        {/* Header section - mobilní optimalizace */}
        <section className={`mb-${isMobile ? '4' : '6'}`}>
          <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
            <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-full bg-primary/10`}>
              <Map className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-primary`} />
            </div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>
              {isMobile ? 'Plánování cest' : 'Personalizované plánování cest'}
            </h1>
          </div>
          
          <p className={`text-muted-foreground ${isMobile ? 'text-sm text-center' : 'text-lg'} max-w-3xl`}>
            {isMobile 
              ? 'Optimalizujte své dojíždění, ušetřete náklady a čas.' 
              : 'Optimalizujte své každodenní dojíždění, ušetřete náklady a čas s našimi nástroji pro plánování cest. Přizpůsobte své cesty podle vašich směn a sdílejte jízdy s ostatními pendlery.'
            }
          </p>
        </section>
        
        {/* Main content - mobilní optimalizace */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className={`${isMobile ? 'grid grid-cols-2 gap-1 h-auto p-1' : 'w-full justify-start max-w-3xl'} overflow-x-auto`}>
            <TabsTrigger 
              value="optimizer" 
              className={`flex items-center gap-2 ${isMobile ? 'flex-col py-2 px-1 text-xs' : ''}`}
            >
              <Car className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span className={isMobile ? 'text-[10px] leading-tight' : ''}>
                {isMobile ? "Optimalizace" : "Optimalizace dojíždění"}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="ridesharing" 
              className={`flex items-center gap-2 ${isMobile ? 'flex-col py-2 px-1 text-xs' : ''}`}
            >
              <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span className={isMobile ? 'text-[10px] leading-tight' : ''}>
                {isMobile ? "Sdílení" : "Sdílení jízd"}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="calculator" 
              className={`flex items-center gap-2 ${isMobile ? 'flex-col py-2 px-1 text-xs' : ''}`}
            >
              <Calculator className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span className={isMobile ? 'text-[10px] leading-tight' : ''}>
                {isMobile ? "Kalkulačka" : "Kalkulačka nákladů"}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="predictions" 
              className={`flex items-center gap-2 ${isMobile ? 'flex-col py-2 px-1 text-xs' : ''}`}
            >
              <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <span className={isMobile ? 'text-[10px] leading-tight' : ''}>
                {isMobile ? "Predikce" : "Predikce dopravy"}
              </span>
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
