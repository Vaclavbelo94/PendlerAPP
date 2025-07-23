
import React, { useState, Suspense } from 'react';
import { Helmet } from "react-helmet";
import { Map, Users, Navigation, TrendingUp, Route } from "lucide-react";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { useIsMobile } from "@/hooks/use-mobile";
import Layout from "@/components/layouts/Layout";
import { NavbarRightContent } from "@/components/layouts/NavbarPatch";
import TravelNavigation from "@/components/travel/TravelNavigation";
import DashboardBackground from "@/components/common/DashboardBackground";
import { EnhancedRideSharingLazy } from "@/components/travel/LazyTravelComponents";
import HomeWorkTrafficMonitor from "@/components/travel/HomeWorkTrafficMonitor";
import { Skeleton } from "@/components/ui/skeleton";
import TravelMobileCarousel from "@/components/travel/mobile/TravelMobileCarousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

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
  const { t } = useTranslation(['travel', 'common']);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "ridesharing":
        return <EnhancedRideSharingLazy />;
      case "commute-traffic":
        return <HomeWorkTrafficMonitor />;
      default:
        return <EnhancedRideSharingLazy />;
    }
  };

  // Feature overview cards
  const featureCards = [
    {
      icon: Users,
      title: t('travel:ridesharing'),
      description: t('travel:ridesharingDesc'),
      badge: "Aktivní",
      color: "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    },
    {
      icon: Navigation,
      title: t('travel:commuteTraffic'),
      description: t('travel:commuteTrafficDesc'),
      badge: "Live",
      color: "bg-green-500/10 text-green-700 dark:text-green-400"
    },
    {
      icon: Route,
      title: t('travel:routeOptimization'),
      description: t('travel:smartRecommendations'),
      badge: "Smart",
      color: "bg-purple-500/10 text-purple-700 dark:text-purple-400"
    },
    {
      icon: TrendingUp,
      title: t('travel:trafficAnalysis'),
      description: t('travel:predictiveTraffic'),
      badge: "Pro",
      color: "bg-orange-500/10 text-orange-700 dark:text-orange-400"
    }
  ];

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <PremiumCheck featureKey="travel_planning">
        <Helmet>
          <title>{t('travel:travelPlanning')} | Pendlerův Pomocník</title>
        </Helmet>
        
        <DashboardBackground variant="travel">
          <div className="container mx-auto px-4 py-6">
            {/* Modern Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm">
                  <Map className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {t('travel:travelPlanning')}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {t('travel:travelDescription')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Desktop Layout */}
            {!isMobile ? (
              <div className="space-y-6">
                {/* Feature Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {featureCards.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-lg ${feature.color}`}>
                              <feature.icon className="h-5 w-5" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {feature.badge}
                            </Badge>
                          </div>
                          <CardTitle className="text-base">{feature.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation */}
                <TravelNavigation
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
                
                {/* Content */}
                <Suspense fallback={<LoadingFallback />}>
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {renderTabContent()}
                  </motion.div>
                </Suspense>
              </div>
            ) : (
              /* Mobile Layout */
              <TravelMobileCarousel 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
                origin={origin}
                destination={destination}
                onOriginChange={setOrigin}
                onDestinationChange={setDestination}
              />
            )}
          </div>
        </DashboardBackground>
      </PremiumCheck>
    </Layout>
  );
};

export default TravelPlanning;
