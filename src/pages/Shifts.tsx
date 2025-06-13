
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import PremiumCheck from '@/components/premium/PremiumCheck';
import ShiftsNavigation from '@/components/shifts/ShiftsNavigation';
import ShiftsCalendar from '@/components/shifts/ShiftsCalendar';
import ShiftsOverview from '@/components/shifts/ShiftsOverview';
import ShiftsAnalytics from '@/components/shifts/ShiftsAnalytics';
import { useState } from 'react';

const Shifts: React.FC = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('calendar');

  const renderSectionContent = () => {
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
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5">
          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
          </div>

          <div className="relative z-10">
            <div className="container max-w-7xl py-8 px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                  {t('shifts')}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Správa směn, plánování a sledování pracovní doby
                </p>
              </motion.div>

              {/* Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
              >
                <ShiftsNavigation
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {renderSectionContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </PremiumCheck>
    </>
  );
};

export default Shifts;
