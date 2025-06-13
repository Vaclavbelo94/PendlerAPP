
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Plus, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { VehicleData } from '@/types/vehicle';
import { UnifiedGrid } from '@/components/layout/UnifiedGrid';
import VehicleNavigation from './VehicleNavigation';
import VehicleSelectorOptimized from './VehicleSelectorOptimized';
import FuelConsumptionCard from './FuelConsumptionCard';
import ServiceRecordCard from './ServiceRecordCard';
import InsuranceCard from './InsuranceCard';
import DocumentsCard from './DocumentsCard';
import EmptyVehicleState from './EmptyVehicleState';
import VehicleForm from './VehicleForm';
import DeleteVehicleDialog from './DeleteVehicleDialog';

interface VehiclePageContentProps {
  vehicleManagement: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAddSheetOpen: boolean;
  setIsAddSheetOpen: (open: boolean) => void;
  isEditSheetOpen: boolean;
  setIsEditSheetOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingVehicle: VehicleData | null;
  setEditingVehicle: (vehicle: VehicleData | null) => void;
  deletingVehicle: VehicleData | null;
  setDeletingVehicle: (vehicle: VehicleData | null) => void;
  onAddVehicle: (formData: any) => Promise<void>;
  onEditVehicle: (formData: any) => Promise<void>;
  onDeleteVehicle: () => Promise<void>;
  onOpenEditDialog: (vehicle: VehicleData) => void;
  onOpenDeleteDialog: (vehicle: VehicleData) => void;
}

const VehiclePageContent: React.FC<VehiclePageContentProps> = ({
  vehicleManagement,
  activeTab,
  setActiveTab,
  isAddSheetOpen,
  setIsAddSheetOpen,
  isEditSheetOpen,
  setIsEditSheetOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  editingVehicle,
  setEditingVehicle,
  deletingVehicle,
  setDeletingVehicle,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onOpenEditDialog,
  onOpenDeleteDialog
}) => {
  const {
    vehicles,
    selectedVehicle,
    selectedVehicleId,
    isSaving,
    selectVehicle
  } = vehicleManagement;

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
            <DocumentsCard vehicleId={selectedVehicleId} />
          </UnifiedGrid>
        );
      case "fuel":
        return <FuelConsumptionCard vehicleId={selectedVehicleId} fullView />;
      case "service":
        return <ServiceRecordCard vehicleId={selectedVehicleId} fullView />;
      case "documents":
        return <DocumentsCard vehicleId={selectedVehicleId} fullView />;
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
            onClick={() => setIsAddSheetOpen(true)} 
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Přidat vozidlo
          </Button>
        </motion.div>
      </div>
      
      {vehicles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <EmptyVehicleState onAddVehicle={() => setIsAddSheetOpen(true)} />
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
      
      {/* Add Vehicle Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Přidat nové vozidlo
            </SheetTitle>
            <SheetDescription>
              Vyplňte údaje o vašem vozidle. Všechna pole označená * jsou povinná.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <VehicleForm
              onSubmit={onAddVehicle}
              onCancel={() => setIsAddSheetOpen(false)}
              isLoading={isSaving}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Vehicle Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Upravit vozidlo
            </SheetTitle>
            <SheetDescription>
              Upravte údaje o vašem vozidle.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <VehicleForm
              onSubmit={onEditVehicle}
              onCancel={() => {
                setIsEditSheetOpen(false);
                setEditingVehicle(null);
              }}
              isLoading={isSaving}
              vehicle={editingVehicle || undefined}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Vehicle Dialog */}
      <DeleteVehicleDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingVehicle(null);
        }}
        onConfirm={onDeleteVehicle}
        vehicle={deletingVehicle}
        isLoading={isSaving}
      />
    </div>
  );
};

export default VehiclePageContent;
