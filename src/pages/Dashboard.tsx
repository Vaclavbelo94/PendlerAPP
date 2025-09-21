
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernDashboard from '@/components/dashboard/modern/ModernDashboard';
import PostLoginLoading from '@/components/dashboard/PostLoginLoading';
import { usePostLoginLoading } from '@/hooks/usePostLoginLoading';

const Dashboard: React.FC = () => {
  const { shouldShow, progress, currentStep } = usePostLoginLoading();

  return (
    <AnimatePresence mode="wait">
      {shouldShow ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PostLoginLoading 
            progress={progress} 
            currentStep={currentStep} 
          />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ModernDashboard />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dashboard;
