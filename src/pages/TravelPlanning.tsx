
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Car, Calculator, Map, Users, Clock, ArrowLeft } from "lucide-react";
import PremiumCheck from "@/components/premium/PremiumCheck";
import CommuteOptimizer from "@/components/travel/CommuteOptimizer";
import RideSharing from "@/components/travel/RideSharing";
import CommuteCostCalculator from "@/components/travel/CommuteCostCalculator";
import TrafficPredictions from "@/components/travel/TrafficPredictions";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Import responsive components
import { ResponsiveTabs, ResponsiveTabsList, ResponsiveTabsTrigger, ResponsiveTabsContent } from "@/components/ui/responsive-tabs";
import ResponsivePage from "@/components/layouts/ResponsivePage";
import AccessibleButton from "@/components/ui/accessible-button";

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
      <ResponsivePage>
        <Helmet>
          <title>Plánování cest | Pendler Buddy</title>
        </Helmet>
        
        {/* Back button - mobilní optimalizace */}
        <AccessibleButton 
          variant="outline" 
          onClick={handleNavigateBack} 
          className={`mb-4 ${isMobile ? 'h-8 px-2' : ''}`}
          size={isMobile ? "sm" : "default"}
          ariaLabel="Návrat na předchozí stránku"
          keyboardShortcut="Escape"
        >
          <ArrowLeft className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
          {isMobile ? 'Zpět' : 'Zpět'}
        </AccessibleButton>
        
        {/* Header section - mobilní optimalizace */}
        <section className={`mb-${isMobile ? '4' : '6'}`} role="banner">
          <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
            <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-full bg-primary/10`} role="img" aria-label="Ikona mapy">
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
        <ResponsiveTabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <ResponsiveTabsList>
            <ResponsiveTabsTrigger 
              value="optimizer" 
              icon={<Car className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />}
              description="Optimalizace tras a dopravy"
            >
              {isMobile ? "Optimalizace" : "Optimalizace dojíždění"}
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger 
              value="ridesharing" 
              icon={<Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />}
              description="Hledání spolujízd"
            >
              {isMobile ? "Sdílení" : "Sdílení jízd"}
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger 
              value="calculator" 
              icon={<Calculator className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />}
              description="Výpočet nákladů na dopravu"
            >
              {isMobile ? "Kalkulačka" : "Kalkulačka nákladů"}
            </ResponsiveTabsTrigger>
            <ResponsiveTabsTrigger 
              value="predictions" 
              icon={<Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />}
              description="Předpověď dopravní situace"
            >
              {isMobile ? "Predikce" : "Predikce dopravy"}
            </ResponsiveTabsTrigger>
          </ResponsiveTabsList>
          
          <ResponsiveTabsContent value="optimizer">
            <CommuteOptimizer />
          </ResponsiveTabsContent>
          
          <ResponsiveTabsContent value="ridesharing">
            <RideSharing />
          </ResponsiveTabsContent>
          
          <ResponsiveTabsContent value="calculator">
            <CommuteCostCalculator />
          </ResponsiveTabsContent>
          
          <ResponsiveTabsContent value="predictions">
            <TrafficPredictions />
          </ResponsiveTabsContent>
        </ResponsiveTabs>
      </ResponsivePage>
    </PremiumCheck>
  );
};

export default TravelPlanning;
