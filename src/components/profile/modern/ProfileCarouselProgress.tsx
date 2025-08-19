import React from 'react';
import { motion } from 'framer-motion';
import { User, Car, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProfileCarouselProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick?: (step: number) => void;
  availableTabs: string[];
}

export const ProfileCarouselProgress: React.FC<ProfileCarouselProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick,
  availableTabs
}) => {
  const { t } = useTranslation('profile');

  const getStepIcon = (tabName: string, isActive: boolean) => {
    const iconClass = `h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`;
    
    switch (tabName) {
      case 'basic':
        return <User className={iconClass} />;
      case 'rides':
        return <Car className={iconClass} />;
      case 'dhl':
        return <Building2 className={iconClass} />;
      default:
        return <User className={iconClass} />;
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted-foreground/20 -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-primary to-accent -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        {/* Step Icons */}
        <div className="relative flex justify-between">
          {availableTabs.map((tab, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <motion.button
                key={tab}
                className={`
                  flex flex-col items-center relative z-10 p-3 rounded-full transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary to-accent shadow-lg scale-110' 
                    : isCompleted
                    ? 'bg-primary/20 hover:bg-primary/30'
                    : 'bg-background border-2 border-muted-foreground/20 hover:border-muted-foreground/40'
                  }
                `}
                onClick={() => onStepClick?.(index)}
                whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {getStepIcon(tab, isActive)}
                
                {/* Step Label */}
                <span className={`
                  mt-2 text-xs font-medium transition-colors duration-300
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                  }
                `}>
                  {t(`tabs.${tab}`)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Step Counter */}
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
    </div>
  );
};