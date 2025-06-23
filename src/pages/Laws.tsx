
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import PremiumCheck from '@/components/premium/PremiumCheck';
import LawsNavigation from '@/components/laws/LawsNavigation';
import LawsLoadingSkeleton from '@/components/laws/LawsLoadingSkeleton';
import LawsMobileCarousel from '@/components/laws/mobile/LawsMobileCarousel';
import DashboardBackground from '@/components/common/DashboardBackground';
import { getLawItems } from '@/data/lawsData';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/useLanguage';
import EnhancedLawCard from '@/components/laws/enhanced/EnhancedLawCard';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { Law } from '@/types/laws';
import { useTranslation } from 'react-i18next';

const Laws = () => {
  const [activeSection, setActiveSection] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { t: tLang } = useLanguage();
  const { t } = useTranslation(['laws', 'common']);

  // Simulate initial loading with shorter duration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const lawItems = getLawItems(tLang);

  const filteredLaws = useMemo(() => {
    if (activeSection === "all") {
      return lawItems;
    }
    return lawItems.filter(law => law.category === activeSection);
  }, [activeSection, lawItems]);

  // Convert LawItem to Law type for EnhancedLawCard
  const convertToLaw = (lawItem: any) => ({
    id: lawItem.id,
    title: lawItem.title,
    summary: lawItem.description,
    category: lawItem.category,
    lastUpdated: lawItem.updated,
    importance: 5,
    tags: [lawItem.category],
    officialUrl: lawItem.path
  });

  const handleViewDetails = (law: Law) => {
    if (law.officialUrl) {
      window.open(law.officialUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <PremiumCheck featureKey="laws">
          <DashboardBackground variant="laws">
            <LawsLoadingSkeleton />
          </DashboardBackground>
        </PremiumCheck>
      </Layout>
    );
  }

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <PremiumCheck featureKey="laws">
        <DashboardBackground variant="laws">
          <div className="container mx-auto px-4 py-8">
            {/* Header section with dashboard-style animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
                <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full bg-white/10 backdrop-blur-sm border border-white/20`}>
                  <Scale className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
                </div>
                <div>
                  <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight text-white`}>
                    {isMobile ? t('laws:germanLaws') : t('laws:lawsGuide')}
                  </h1>
                  <p className={`text-white/80 ${isMobile ? 'text-sm mt-2' : 'text-lg mt-2'} max-w-3xl`}>
                    {isMobile ? t('laws:lawsDescriptionMobile') : t('laws:lawsDescription')}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Mobile: Swipe Carousel */}
            {isMobile ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <LawsMobileCarousel
                  activeCategory={activeSection}
                  onCategoryChange={setActiveSection}
                />
              </motion.div>
            ) : (
              /* Desktop: Traditional Navigation + Grid */
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <LawsNavigation
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredLaws.map((law, index) => (
                    <EnhancedLawCard 
                      key={law.id} 
                      law={convertToLaw(law)} 
                      index={index}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </DashboardBackground>
      </PremiumCheck>
    </Layout>
  );
};

export default Laws;
