
import React, { useState, Suspense } from 'react';
import { Helmet } from "react-helmet";
import { Map, Users, Navigation, TrendingUp, Route, Car, Clock, MapPin } from "lucide-react";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { useIsMobile } from "@/hooks/use-mobile";
import Layout from "@/components/layouts/Layout";
import { NavbarRightContent } from "@/components/layouts/NavbarPatch";
import ModernTravelNavigation from "@/components/travel/navigation/ModernTravelNavigation";
import DashboardBackground from "@/components/common/DashboardBackground";
import { EnhancedRideSharingLazy } from "@/components/travel/LazyTravelComponents";
import HomeWorkTrafficMonitor from "@/components/travel/HomeWorkTrafficMonitor";
import { Skeleton } from "@/components/ui/skeleton";
import ModernTravelMobileCarousel from "@/components/travel/mobile/ModernTravelMobileCarousel";
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

  // Feature overview cards with modern design
  const featureCards = [
    {
      icon: Users,
      title: t('travel:ridesharing'),
      description: t('travel:ridesharingDesc'),
      badge: "Live",
      color: "from-blue-500/10 to-blue-600/10 border-blue-500/20",
      stats: { value: "24", label: t('travel:activeOffers') }
    },
    {
      icon: Navigation,
      title: t('travel:commuteTraffic'),
      description: t('travel:commuteTrafficDesc'),
      badge: "Real-time",
      color: "from-green-500/10 to-green-600/10 border-green-500/20",
      stats: { value: "3", label: t('travel:activeRoutes') }
    },
    {
      icon: Route,
      title: t('travel:routeOptimization'),
      description: t('travel:smartRecommendations'),
      badge: "AI",
      color: "from-purple-500/10 to-purple-600/10 border-purple-500/20",
      stats: { value: "15min", label: t('travel:avgTimeSaved') }
    },
    {
      icon: TrendingUp,
      title: t('travel:trafficAnalysis'),
      description: t('travel:predictiveTraffic'),
      badge: "Pro",
      color: "from-orange-500/10 to-orange-600/10 border-orange-500/20",
      stats: { value: "92%", label: t('travel:accuracy') }
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
            {/* Modern Hero Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/20 shadow-lg">
                  <Map className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {t('travel:travelPlanning')}
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    {t('travel:travelDescription')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Desktop Layout */}
            {!isMobile ? (
              <div className="space-y-8">
                {/* Modern Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featureCards.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      <Card className={`relative overflow-hidden bg-gradient-to-br ${feature.color} border-0 hover:shadow-lg transition-all duration-300`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm">
                              <feature.icon className="h-5 w-5 text-primary" />
                            </div>
                            <Badge variant="secondary" className="text-xs font-medium">
                              {feature.badge}
                            </Badge>
                          </div>
                          <CardTitle className="text-base font-semibold text-foreground">
                            {feature.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-primary">
                              {feature.stats.value}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {feature.stats.label}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Modern Navigation */}
                <ModernTravelNavigation
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
                
                {/* Content with Enhanced Animation */}
                <Suspense fallback={<LoadingFallback />}>
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    {renderTabContent()}
                  </motion.div>
                </Suspense>
              </div>
            ) : (
              /* Enhanced Mobile Layout */
              <ModernTravelMobileCarousel 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
              />
            )}
          </div>
        </DashboardBackground>
      </PremiumCheck>
    </Layout>
  );
};

export default TravelPlanning;
