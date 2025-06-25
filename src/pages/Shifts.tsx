
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import PremiumCheck from '@/components/premium/PremiumCheck';
import DashboardBackground from '@/components/common/DashboardBackground';
import ShiftsMobileCarousel from '@/components/shifts/mobile/ShiftsMobileCarousel';
import ShiftsNavigation from '@/components/shifts/ShiftsNavigation';
import ShiftsCalendar from '@/components/shifts/ShiftsCalendar';
import ShiftsAnalytics from '@/components/shifts/ShiftsAnalytics';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { useIsMobile } from '@/hooks/use-mobile';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

const Shifts: React.FC = () => {
  const { t } = useTranslation('shifts');
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('calendar');
  const isMobile = useIsMobile();

  const {
    shifts,
    isLoading,
    error
  } = useOptimizedShiftsManagement(user?.id);

  const renderDesktopContent = () => {
    switch (activeSection) {
      case 'calendar':
        return <ShiftsCalendar />;
      case 'analytics':
        return <ShiftsAnalytics shifts={shifts} />;
      default:
        return <ShiftsCalendar />;
    }
  };

  const renderMobileContent = () => {
    return (
      <ShiftsMobileCarousel
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        shifts={shifts}
        isLoading={isLoading}
      />
    );
  };

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>{t('title')} | PendlerApp</title>
        <meta name="description" content={t('shiftsDescription')} />
      </Helmet>
      
      <PremiumCheck featureKey="shifts">
        <DashboardBackground variant="default">
          <div className={`mx-auto px-4 py-8 ${isMobile ? 'container' : 'max-w-full'}`}>
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
                    {t('title')}
                  </h1>
                  <p className={`text-white/80 ${isMobile ? 'text-sm mt-2' : 'text-lg mt-2'} max-w-3xl`}>
                    {t('shiftsDescription')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Error state */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm rounded-lg border border-red-500/20"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Mobile: Swipe Carousel */}
            {isMobile ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {renderMobileContent()}
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
                  className="bg-background/95 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl p-8"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    renderDesktopContent()
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </DashboardBackground>
      </PremiumCheck>
    </Layout>
  );
};

export default Shifts;
