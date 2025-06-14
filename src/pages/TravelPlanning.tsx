
import React, { useState, Suspense } from 'react';
import { Helmet } from "react-helmet";
import { Map } from "lucide-react";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { useIsMobile } from "@/hooks/use-mobile";
import ResponsivePage from "@/components/layouts/ResponsivePage";
import TravelNavigation from "@/components/travel/TravelNavigation";
import DashboardBackground from "@/components/common/DashboardBackground";
import { EnhancedRideSharingLazy, TrafficMapLazy } from "@/components/travel/LazyTravelComponents";
import { Skeleton } from "@/components/ui/skeleton";
import TravelMobileCarousel from "@/components/travel/mobile/TravelMobileCarousel";

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-48 w-full" />
  </div>
);

const TravelPlanning = () => {
  const [activeTab, setActiveTab] = useState("ridesharing");
  const [origin, setOrigin] = useState("Praha, Česká republika");
  const [destination, setDestination] = useState("Dresden, Německo");
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "ridesharing":
        return <EnhancedRideSharingLazy />;
      case "traffic":
        return (
          <TrafficMapLazy 
            origin={origin} 
            destination={destination}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
          />
        );
      default:
        return <EnhancedRideSharingLazy />;
    }
  };

  return (
    <PremiumCheck featureKey="travel_planning">
      <DashboardBackground variant="travel">
        <ResponsivePage enableLandscapeOptimization={true}>
          <Helmet>
            <title>Plánování cest | Pendlerův Pomocník</title>
          </Helmet>
          
          {/* Header section */}
          <section className={`mb-${isMobile ? '4' : '6'}`} role="banner">
            <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
              <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-full bg-primary/10`} role="img" aria-label="Ikona mapy">
                <Map className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-primary`} />
              </div>
              <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-white`}>
                {isMobile ? 'Chytré cestování' : 'Plánování cest'}
              </h1>
            </div>
            
            <p className={`text-white/80 ${isMobile ? 'text-sm text-center' : 'text-lg'} max-w-3xl`}>
              {isMobile 
                ? 'Spolujízdy a aktuální dopravní situace.' 
                : 'Sdílení jízd s ostatními pendlery a sledování aktuální dopravní situace v reálném čase.'
              }
            </p>
          </section>
          
          {/* Mobile or Desktop UI based on device */}
          {isMobile ? (
            <TravelMobileCarousel 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
              origin={origin}
              destination={destination}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
            />
          ) : (
            <>
              {/* Navigation - only two tabs now */}
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
            </>
          )}
        </ResponsivePage>
      </DashboardBackground>
    </PremiumCheck>
  );
};

export default TravelPlanning;
