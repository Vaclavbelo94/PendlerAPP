
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Map } from 'lucide-react';
import Layout from '@/components/layouts/Layout';
import TravelNavigation from '@/components/travel/TravelNavigation';
import CommuteOptimizer from '@/components/travel/CommuteOptimizer';
import RideSharing from '@/components/travel/RideSharing';
import TravelAnalyticsDashboard from '@/components/travel/TravelAnalyticsDashboard';
import TravelMobileCarousel from '@/components/travel/mobile/TravelMobileCarousel';
import DashboardBackground from '@/components/common/DashboardBackground';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

const Travel = () => {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState('optimizer');
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeTab) {
      case 'optimizer':
        return <CommuteOptimizer />;
      case 'rideshare':
        return <RideSharing />;
      case 'analytics':
        return <TravelAnalyticsDashboard />;
      default:
        return <CommuteOptimizer />;
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Cestování | PendlerApp</title>
        <meta name="description" content="Plánování cest a dopravy" />
      </Helmet>
      
      <DashboardBackground variant="default">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Map className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Cestování</h1>
              <p className="text-white/80">Plánování cest a optimalizace dopravy</p>
            </div>
          </div>

          {isMobile ? (
            <TravelMobileCarousel
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          ) : (
            <>
              <TravelNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <div className="mt-8">
                {renderContent()}
              </div>
            </>
          )}
        </div>
      </DashboardBackground>
    </Layout>
  );
};

export default Travel;
