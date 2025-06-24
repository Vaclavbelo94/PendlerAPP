
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaxWizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const TaxWizardProgress: React.FC<TaxWizardProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels
}) => {
  const { t } = useTranslation('common');
  const isMobile = useIsMobile();
  
  // Na mobilech nezobrazujeme tento progress - používáme carousel
  if (isMobile) {
    return null;
  }
  
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4 gap-4">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center relative flex-1 min-w-0">
                <motion.div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                    isCompleted 
                      ? "bg-green-500 text-white" 
                      : isCurrent 
                      ? "bg-primary text-white" 
                      : "bg-muted text-muted-foreground"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>
                
                <span className={cn(
                  "text-xs mt-2 text-center px-1 leading-tight",
                  isCurrent ? "text-primary font-medium" : "text-muted-foreground"
                )}>
                  {label}
                </span>
                
                {/* Connection line */}
                {index < stepLabels.length - 1 && (
                  <div className="absolute top-4 left-8 right-[-2rem] h-0.5 bg-muted -z-10 hidden lg:block">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: stepNumber < currentStep ? "100%" : "0%" 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Step counter */}
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          {t('step')} {currentStep} {t('of')} {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default TaxWizardProgress;
