
import React, { useState, Suspense } from 'react';
import { Helmet } from "react-helmet";
import { Map } from "lucide-react";
import PremiumCheck from "@/components/premium/PremiumCheck";
import Layout from "@/components/layouts/Layout";
import { NavbarRightContent } from "@/components/layouts/NavbarPatch";
import DashboardBackground from "@/components/common/DashboardBackground";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ModernTravelMobileCarousel from "@/components/travel/mobile/ModernTravelMobileCarousel";

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-48 w-full" />
  </div>
);

const TravelPlanning = () => {
  const { t } = useTranslation(['travel', 'common']);
  const [activeTab, setActiveTab] = useState('ridesharing');

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <PremiumCheck featureKey="travel_planning">
        <Helmet>
          <title>{t('travel:travelPlanning')} | Pendlerův Pomocník</title>
        </Helmet>
        
        <DashboardBackground variant="travel">
          <div className="container mx-auto px-4 py-6">
            {/* Simple Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm border border-primary/20 shadow-lg">
                  <Map className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {t('travel:travelPlanning')}
                  </h1>
                  <p className="text-muted-foreground">
                    {t('travel:travelDescription')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Travel Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <ModernTravelMobileCarousel
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </Suspense>
            </motion.div>
          </div>
        </DashboardBackground>
      </PremiumCheck>
    </Layout>
  );
};

export default TravelPlanning;
