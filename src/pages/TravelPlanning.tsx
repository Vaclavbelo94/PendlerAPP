
import React, { useState, Suspense } from 'react';
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Map, ArrowLeft } from "lucide-react";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ResponsivePage from "@/components/layouts/ResponsivePage";
import AccessibleButton from "@/components/ui/accessible-button";
import TravelNavigation from "@/components/travel/TravelNavigation";
import { 
  CommuteOptimizerLazy,
  RideSharingLazy, 
  CommuteCostCalculatorLazy,
  TrafficPredictionsLazy,
  TravelAnalyticsLazy
} from "@/components/travel/LazyTravelComponents";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-48 w-full" />
  </div>
);

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
      case "analytics": return "Analytics";
      default: return "";
    }
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "optimizer":
        return <CommuteOptimizerLazy />;
      case "ridesharing":
        return <RideSharingLazy />;
      case "calculator":
        return <CommuteCostCalculatorLazy />;
      case "predictions":
        return <TrafficPredictionsLazy />;
      case "analytics":
        return <TravelAnalyticsLazy />;
      default:
        return <CommuteOptimizerLazy />;
    }
  };

  return (
    <PremiumCheck featureKey="travel_planning">
      <ResponsivePage enableLandscapeOptimization={true}>
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
        
        {/* Navigation */}
        <TravelNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        {/* Tab content with suspense */}
        <Suspense fallback={<LoadingFallback />}>
          <div className="space-y-4">
            {renderTabContent()}
          </div>
        </Suspense>
      </ResponsivePage>
    </PremiumCheck>
  );
};

export default TravelPlanning;
