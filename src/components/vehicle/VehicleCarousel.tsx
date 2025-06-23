
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { VehicleData } from '@/types/vehicle';
import { useTranslation } from 'react-i18next';
import VehicleCarouselProgress from './VehicleCarouselProgress';
import FuelConsumptionCard from './FuelConsumptionCard';
import ServiceRecordCard from './ServiceRecordCard';
import { UnifiedGrid } from '@/components/layout/UnifiedGrid';

interface VehicleCarouselProps {
  selectedVehicle: VehicleData;
  vehicleId: string;
}

const VehicleCarousel: React.FC<VehicleCarouselProps> = ({
  selectedVehicle,
  vehicleId
}) => {
  const { t } = useTranslation(['vehicle']);
  const [currentStep, setCurrentStep] = useState(1);
  
  const steps = ['overview', 'fuel', 'service'];
  const stepLabels = [
    t('vehicle:overview'),
    t('vehicle:fuel'),
    t('vehicle:service')
  ];

  const { containerRef } = useSwipeNavigation({
    items: steps,
    currentItem: steps[currentStep - 1],
    onItemChange: (step) => {
      const stepIndex = steps.indexOf(step) + 1;
      setCurrentStep(stepIndex);
    },
    enabled: true
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: // Přehled
        return (
          <div className="space-y-6">
            {/* Základní informace o vozidle */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">
                {selectedVehicle.brand} {selectedVehicle.model}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('vehicle:year')}:</span>
                  <span className="ml-2 font-medium">{selectedVehicle.year}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('vehicle:licensePlate')}:</span>
                  <span className="ml-2 font-medium">{selectedVehicle.license_plate}</span>
                </div>
                {selectedVehicle.fuel_type && (
                  <div>
                    <span className="text-muted-foreground">{t('vehicle:fuelType')}:</span>
                    <span className="ml-2 font-medium">{selectedVehicle.fuel_type}</span>
                  </div>
                )}
                {selectedVehicle.mileage && (
                  <div>
                    <span className="text-muted-foreground">{t('vehicle:mileage')}:</span>
                    <span className="ml-2 font-medium">{selectedVehicle.mileage} km</span>
                  </div>
                )}
                {selectedVehicle.average_consumption && (
                  <div>
                    <span className="text-muted-foreground">{t('vehicle:fuel.averageConsumption')}:</span>
                    <span className="ml-2 font-medium">{selectedVehicle.average_consumption} {t('vehicle:fuel.per100km')}</span>
                  </div>
                )}
                {selectedVehicle.engine && (
                  <div>
                    <span className="text-muted-foreground">{t('vehicle:engineType')}:</span>
                    <span className="ml-2 font-medium">{selectedVehicle.engine}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Přehledové karty */}
            <UnifiedGrid columns={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
              <FuelConsumptionCard vehicleId={vehicleId} />
              <ServiceRecordCard vehicleId={vehicleId} />
            </UnifiedGrid>
          </div>
        );
      case 2: // Spotřeba
        return <FuelConsumptionCard vehicleId={vehicleId} fullView />;
      case 3: // Servis
        return <ServiceRecordCard vehicleId={vehicleId} fullView />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto" ref={containerRef}>
      <VehicleCarouselProgress
        currentStep={currentStep}
        totalSteps={3}
        stepLabels={stepLabels}
        onStepClick={handleStepClick}
      />

      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('ui:previous')}
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentStep === 3}
          className="flex items-center gap-2"
          variant={currentStep === 3 ? "outline" : "default"}
        >
          {t('ui:next')}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VehicleCarousel;
