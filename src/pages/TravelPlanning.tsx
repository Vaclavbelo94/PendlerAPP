
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

  const tabs = [
    {
      id: "optimizer",
      label: isMobile ? "Optimalizace" : "Optimalizace dojíždění",
      icon: Car,
      description: "Optimalizace tras a dopravy"
    },
    {
      id: "ridesharing",
      label: isMobile ? "Sdílení" : "Sdílení jízd",
      icon: Users,
      description: "Hledání spolujízd"
    },
    {
      id: "calculator",
      label: isMobile ? "Kalkulačka" : "Kalkulačka nákladů",
      icon: Calculator,
      description: "Výpočet nákladů na dopravu"
    },
    {
      id: "predictions",
      label: isMobile ? "Predikce" : "Predikce dopravy",
      icon: Clock,
      description: "Předpověď dopravní situace"
    }
  ];

  return (
    <PremiumCheck featureKey="travel_planning">
      <ResponsivePage>
        <Helmet>
          <title>Plánování cest | Pendler Buddy</title>
        </Helmet>
        
        {/* Back button */}
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
        
        {/* Header section */}
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
        
        {/* Tabs navigation */}
        <div className={`grid gap-2 mb-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 p-4 rounded-lg border transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card hover:bg-accent'
                } ${isMobile ? 'flex-col text-center' : ''}`}
              >
                <Icon className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                  {tab.label}
                </span>
                {!isMobile && (
                  <span className="sr-only">{tab.description}</span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Tab content */}
        <div className="space-y-4">
          {activeTab === "optimizer" && <CommuteOptimizer />}
          {activeTab === "ridesharing" && <RideSharing />}
          {activeTab === "calculator" && <CommuteCostCalculator />}
          {activeTab === "predictions" && <TrafficPredictions />}
        </div>
      </ResponsivePage>
    </PremiumCheck>
  );
};

export default TravelPlanning;
