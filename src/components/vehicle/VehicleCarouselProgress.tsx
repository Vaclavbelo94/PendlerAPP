
import React from 'react';
import { motion } from 'framer-motion';
import { Car, Gauge, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VehicleCarouselProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  onStepClick?: (step: number) => void;
}

const VehicleCarouselProgress: React.FC<VehicleCarouselProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  onStepClick
}) => {
  const { t } = useTranslation(['ui']);
  const icons = [Car, Gauge, Wrench];

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative mb-6">
        <div className="flex justify-between items-center">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const Icon = icons[index];

            return (
              <div
                key={stepNumber}
                className={`flex flex-col items-center cursor-pointer ${
                  onStepClick ? 'hover:opacity-75' : ''
                }`}
                onClick={() => onStepClick?.(stepNumber)}
              >
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {stepLabels[index]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Connecting line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted -z-10">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step counter */}
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          {t('ui:step')} {currentStep} {t('ui:of')} {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default VehicleCarouselProgress;
