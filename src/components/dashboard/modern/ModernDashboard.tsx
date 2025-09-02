
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import DashboardBackground from '@/components/common/DashboardBackground';
import DashboardHero from './DashboardHero';
import DashboardCards from './DashboardCards';
import DashboardStats from './DashboardStats';
import DashboardDHLSection from './DashboardDHLSection';
import { useOptimizedOnboarding } from '@/hooks/useOptimizedOnboarding';
import { useOptimizedDHLData } from '@/hooks/dhl/useOptimizedDHLData';
import { useDHLAutoSetup } from '@/hooks/useDHLAutoSetup';
import { useResponsive } from '@/hooks/useResponsive';

const ModernDashboard: React.FC = () => {
  const { user, unifiedUser } = useAuth();
  const { t } = useTranslation(['dashboard']);
  const { isMobile } = useResponsive();
  
  // Auto-setup DHL employee data
  useDHLAutoSetup();
  
  // Get userAssignment - but only load if user is DHL employee to prevent unnecessary calls
  const { userAssignment } = useOptimizedDHLData(unifiedUser?.isDHLEmployee ? user?.id : null);
  const { showOnboarding, isNewUser } = useOptimizedOnboarding(userAssignment);

  // DHL onboarding logic
  const shouldShowOnboarding = unifiedUser?.isDHLEmployee && showOnboarding && isNewUser;
  const shouldShowDHLContent = unifiedUser?.isDHLEmployee && !showOnboarding && isNewUser;

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>{t('dashboard:title')} | PendlerApp</title>
        <meta name="description" content={t('dashboard:dashboardSubtitle')} />
      </Helmet>
      
      <DashboardBackground variant="default">
        <div className="container max-w-7xl py-8 px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DashboardHero />
          </motion.div>

          {/* DHL Section - shows onboarding or setup notification */}
          {(shouldShowOnboarding || shouldShowDHLContent || unifiedUser?.isDHLEmployee) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <DashboardDHLSection 
                shouldShowOnboarding={shouldShowOnboarding}
                shouldShowDHLContent={shouldShowDHLContent}
              />
            </motion.div>
          )}

          {/* Main Dashboard Cards - 2x2 Grid */}
          {!shouldShowOnboarding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <DashboardCards isDHLUser={!!unifiedUser?.isDHLEmployee} />
            </motion.div>
          )}

          {/* Expandable Statistics Section - Hidden on Mobile */}
          {!shouldShowOnboarding && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <DashboardStats />
            </motion.div>
          )}
        </div>
      </DashboardBackground>
    </Layout>
  );
};

export default ModernDashboard;
