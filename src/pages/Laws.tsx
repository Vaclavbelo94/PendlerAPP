
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import PublicPageWithPremiumCheck from '@/components/premium/PublicPageWithPremiumCheck';
import LawsNavigation from '@/components/laws/LawsNavigation';
import LawsLoadingSkeleton from '@/components/laws/LawsLoadingSkeleton';
import LawsMobileCarousel from '@/components/laws/mobile/LawsMobileCarousel';
import DashboardBackground from '@/components/common/DashboardBackground';
import { lawItems } from '@/data/lawsData';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedLawCard from '@/components/laws/enhanced/EnhancedLawCard';

const Laws = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Simulate initial loading with shorter duration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredLaws = useMemo(() => {
    if (activeCategory === "all") {
      return lawItems;
    }
    return lawItems.filter(law => law.category === activeCategory);
  }, [activeCategory]);

  if (isLoading) {
    return (
      <PublicPageWithPremiumCheck featureName="Zákony" allowPublicAccess={true}>
        <DashboardBackground variant="laws">
          <LawsLoadingSkeleton />
        </DashboardBackground>
      </PublicPageWithPremiumCheck>
    );
  }

  return (
    <PublicPageWithPremiumCheck featureName="Zákony" allowPublicAccess={true}>
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
                  {isMobile ? 'Německé zákony' : 'Průvodce německými zákony'}
                </h1>
                <p className={`text-white/80 ${isMobile ? 'text-sm mt-2' : 'text-lg mt-2'} max-w-3xl`}>
                  {isMobile 
                    ? 'Kompletní přehled zákonů pro pendlery v Německu.' 
                    : 'Kompletní přehled nejdůležitějších zákonů a předpisů pro pendlery a zaměstnance v Německu.'
                  }
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
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
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
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
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
                    law={law} 
                    index={index}
                  />
                ))}
              </motion.div>
            </>
          )}
        </div>
      </DashboardBackground>
    </PublicPageWithPremiumCheck>
  );
};

export default Laws;
