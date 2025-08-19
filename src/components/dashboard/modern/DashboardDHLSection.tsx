
import React from 'react';
import ModernDHLWelcome from '@/components/onboarding/ModernDHLWelcome';
import DHLSetupNotification from '@/components/dashboard/DHLSetupNotification';
import OnboardingDashboardContent from '@/components/dashboard/OnboardingDashboardContent';
import { motion } from 'framer-motion';

interface DashboardDHLSectionProps {
  shouldShowOnboarding: boolean;
  shouldShowDHLContent: boolean;
}

const DashboardDHLSection: React.FC<DashboardDHLSectionProps> = ({
  shouldShowOnboarding,
  shouldShowDHLContent
}) => {
  if (shouldShowOnboarding) {
    return <ModernDHLWelcome onComplete={() => window.location.reload()} />;
  }

  if (shouldShowDHLContent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <OnboardingDashboardContent />
      </motion.div>
    );
  }

  // For existing DHL users who haven't completed setup
  return <DHLSetupNotification />;
};

export default DashboardDHLSection;
