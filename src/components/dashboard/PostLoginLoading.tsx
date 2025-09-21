import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCompany } from '@/hooks/useCompany';

interface PostLoginLoadingProps {
  progress: number;
  currentStep: string;
}

const PostLoginLoading: React.FC<PostLoginLoadingProps> = ({ 
  progress, 
  currentStep 
}) => {
  const { t } = useTranslation('postLogin');
  const { company, isDHL, isAdecco, isRandstad } = useCompany();

  // Get company-specific loading message
  const getCompanyMessage = () => {
    if (isDHL) return t('company.dhl');
    if (isAdecco) return t('company.adecco');  
    if (isRandstad) return t('company.randstad');
    return t('steps.checkingCompany');
  };

  // Use company message for checkingCompany step
  const getStepMessage = () => {
    if (currentStep === 'checkingCompany') {
      return getCompanyMessage();
    }
    return t(`steps.${currentStep}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div 
        className="w-full max-w-md px-8 text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo/Spinner */}
        <motion.div 
          className="flex justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <LoadingSpinner size="lg" />
            <motion.div 
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-foreground">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Progress 
            value={progress} 
            className="h-3"
            indicatorClassName="bg-gradient-to-r from-primary to-primary-glow transition-all duration-300"
          />
          
          {/* Progress Percentage */}
          <div className="flex justify-between items-center text-sm">
            <motion.span 
              className="text-muted-foreground"
              key={currentStep}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {getStepMessage()}
            </motion.span>
            <motion.span 
              className="text-primary font-medium"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
        </motion.div>

        {/* Loading Steps Indicator */}
        <motion.div 
          className="flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[0, 1, 2, 3, 4].map((step) => (
            <motion.div
              key={step}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                progress >= (step + 1) * 20 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
              animate={
                progress >= (step + 1) * 20 
                  ? { scale: [1, 1.1, 1] }
                  : {}
              }
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PostLoginLoading;