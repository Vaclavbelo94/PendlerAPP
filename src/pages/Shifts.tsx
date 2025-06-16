
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import PremiumCheck from '@/components/premium/PremiumCheck';
import DashboardBackground from '@/components/common/DashboardBackground';
import ShiftsMobileCarousel from '@/components/shifts/mobile/ShiftsMobileCarousel';
import ShiftsNavigation from '@/components/shifts/ShiftsNavigation';
import ShiftsCalendar from '@/components/shifts/ShiftsCalendar';
import ShiftsOverview from '@/components/shifts/ShiftsOverview';
import ShiftsAnalytics from '@/components/shifts/ShiftsAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';

const Shifts: React.FC = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('calendar');
  const isMobile = useIsMobile();

  const renderDesktopContent = () => {
    switch (activeSection) {
      case 'overview':
        return <ShiftsOverview />;
      case 'calendar':
        return <ShiftsCalendar />;
      case 'analytics':
        return <ShiftsAnalytics />;
      default:
        return <ShiftsCalendar />;
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('shifts')} | PendlerApp</title>
        <meta name="description" content="Správa směn a plánování pracovní doby" />
      </Helmet>
      
      <PremiumCheck featureKey="shifts">
        <DashboardBackground variant="default">
          <div className={`mx-auto px-4 py-8 ${isMobile ? 'container' : 'max-w-[1600px]'}`}>
            {/* Header section with dashboard-style animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'flex-col text-center' : ''}`}>
                <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-full bg-white/10 backdrop-blur-sm border border-white/20`}>
                  <Clock className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
                </div>
                <div>
                  <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight text-white`}>
                    {isMobile ? 'Směny' : 'Správa směn'}
                  </h1>
                  <p className={`text-white/80 ${isMobile ? 'text-sm mt-2' : 'text-lg mt-2'} max-w-3xl`}>
                    {isMobile 
                      ? 'Plánování a sledování pracovní doby.' 
                      : 'Správa směn, plánování a sledování pracovní doby s pokročilými analýzami.'
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
                <ShiftsMobileCarousel
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                />
              </motion.div>
            ) : (
              /* Desktop: Traditional Navigation + Content */
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <ShiftsNavigation
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-background/98 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl p-8 min-h-[600px]"
                >
                  {renderDesktopContent()}
                </motion.div>
              </div>
            )}
          </div>
        </DashboardBackground>
      </PremiumCheck>
    </>
  );
};

export default Shifts;
