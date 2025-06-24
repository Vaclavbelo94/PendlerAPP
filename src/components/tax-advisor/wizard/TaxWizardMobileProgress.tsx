
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface TaxWizardMobileProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
}

const TaxWizardMobileProgress: React.FC<TaxWizardMobileProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  onPrevious,
  onNext,
  canGoNext
}) => {
  const { t } = useTranslation('common');
  
  const currentLabel = stepLabels[currentStep - 1];
  
  return (
    <div className="mb-6">
      {/* Current step with navigation */}
      <div className="flex items-center justify-between mb-4 bg-card border rounded-lg p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="p-2 hover:bg-primary/10"
          aria-label={t('previous') || 'Předchozí'}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
              "bg-primary text-white"
            )}>
              {currentStep}
            </div>
            <h3 className="text-sm font-semibold text-primary">
              {currentLabel}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('step')} {currentStep} {t('of')} {totalSteps}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          disabled={currentStep === totalSteps || !canGoNext}
          className="p-2 hover:bg-primary/10"
          aria-label={t('next') || 'Další'}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center">
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }, (_, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index + 1 === currentStep 
                  ? "bg-primary w-6" 
                  : index + 1 < currentStep
                  ? "bg-green-500"
                  : "bg-muted-foreground/30"
              )}
              initial={{ scale: 0.8 }}
              animate={{ scale: index + 1 === currentStep ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxWizardMobileProgress;
