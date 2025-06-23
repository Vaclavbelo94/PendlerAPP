
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { VehicleData } from '@/types/vehicle';
import { UnifiedGrid } from '@/components/layout/UnifiedGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import VehicleNavigation from './VehicleNavigation';
import VehicleSelectorOptimized from './VehicleSelectorOptimized';
import VehicleCarousel from './VehicleCarousel';
import FuelConsumptionCard from './FuelConsumptionCard';
import ServiceRecordCard from './ServiceRecordCard';
import InsuranceCard from './InsuranceCard';
import OthersCard from './OthersCard';
import EmptyVehicleState from './EmptyVehicleState';

interface VehiclePageContentProps {
  vehicleManagement: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddVehicle: () => void;
  onOpenEditDialog: (vehicle: VehicleData) => void;
  onOpenDeleteDialog: (vehicle: VehicleData) => void;
}

const VehiclePageContent: React.FC<VehiclePageContentProps> = ({
  vehicleManagement,
  activeTab,
  setActiveTab,
  onAddVehicle,
  onOpenEditDialog,
  onOpenDeleteDialog
}) => {
  const {
    vehicles,
    selectedVehicle,
    selectedVehicleId,
    selectVehicle
  } = vehicleManagement;

  const isMobile = useIsMobile();
  const { t } = useTranslation(['vehicle', 'ui']);

  const renderTabContent = () => {
    if (!selectedVehicle || !selectedVehicleId) return null;

    switch (activeTab) {
      case "overview":
        return (
          <UnifiedGrid 
            columns={{ mobile: 1, tablet: 1, desktop: 2 }} 
            gap="lg"
          >
            <FuelConsumptionCard vehicleId={selectedVehicleId} />
            <ServiceRecordCard vehicleId={selectedVehicleId} />
            <InsuranceCard vehicleId={selectedVehicleId} />
          </UnifiedGrid>
        );
      case "fuel":
        return <FuelConsumptionCard vehicleId={selectedVehicleId} fullView />;
      case "service":
        return <ServiceRecordCard vehicleId={selectedVehicleId} fullView />;
      case "others":
        return <OthersCard vehicleId={selectedVehicleId} fullView />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div></div> {/* Spacer */}
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Button 
            onClick={onAddVehicle} 
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            {t('vehicle:addVehicle')}
          </Button>
        </motion.div>
      </div>
      
      {vehicles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <EmptyVehicleState onAddVehicle={onAddVehicle} />
        </motion.div>
      ) : (
        <>
          {/* Vehicle selector with actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <VehicleSelectorOptimized
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onSelect={selectVehicle}
              onEdit={onOpenEditDialog}
              onDelete={onOpenDeleteDialog}
              className="w-full"
            />
          </motion.div>
          
          {selectedVehicle && (
            <>
              {/* Mobile: Use carousel with swipe, Desktop: Use navigation tabs */}
              {isMobile ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="pb-6"
                >
                  <VehicleCarousel
                    selectedVehicle={selectedVehicle}
                    vehicleId={selectedVehicleId}
                  />
                </motion.div>
              ) : (
                <>
                  {/* Navigation */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-6"
                  >
                    <VehicleNavigation
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                    />
                  </motion.div>
                  
                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="pb-6"
                  >
                    {renderTabContent()}
                  </motion.div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default VehiclePageContent;
