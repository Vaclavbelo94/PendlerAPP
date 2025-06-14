
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { useVehicleManagement } from '@/hooks/vehicle/useVehicleManagement';
import { VehicleData } from '@/types/vehicle';
import VehicleCarousel from './VehicleCarousel';
import VehicleErrorBoundary from './VehicleErrorBoundary';
import FastLoadingFallback from '@/components/common/FastLoadingFallback';
import VehicleSelectorOptimized from './VehicleSelectorOptimized';
import EmptyVehicleState from './EmptyVehicleState';
import VehicleForm from './VehicleForm';
import DeleteVehicleDialog from './DeleteVehicleDialog';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Plus, Car } from 'lucide-react';

const VehicleMainContainer: React.FC = () => {
  const { user, isInitialized } = useSimplifiedAuth();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleData | null>(null);

  const vehicleManagement = useVehicleManagement(user?.id);

  const handleAddVehicle = async (formData: any) => {
    const newVehicle = await vehicleManagement.addVehicle(formData);
    if (newVehicle) {
      setIsAddSheetOpen(false);
    }
  };

  const handleEditVehicle = async (formData: any) => {
    if (!editingVehicle) return;
    
    const updatedVehicle = await vehicleManagement.updateVehicle({ ...formData, id: editingVehicle.id });
    if (updatedVehicle) {
      setIsEditSheetOpen(false);
      setEditingVehicle(null);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!deletingVehicle?.id) return;
    
    await vehicleManagement.removeVehicle(deletingVehicle.id);
    setIsDeleteDialogOpen(false);
    setDeletingVehicle(null);
  };

  const openEditDialog = (vehicle: VehicleData) => {
    setEditingVehicle(vehicle);
    setIsEditSheetOpen(true);
  };

  const openDeleteDialog = (vehicle: VehicleData) => {
    setDeletingVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  if (!isInitialized) {
    return <FastLoadingFallback message="Inicializace..." />;
  }

  if (vehicleManagement.error && !vehicleManagement.isLoading) {
    // Safely convert error to Error object
    let errorObj: Error;
    if (vehicleManagement.error && typeof vehicleManagement.error === 'object' && 'message' in vehicleManagement.error) {
      errorObj = vehicleManagement.error as Error;
    } else {
      errorObj = new Error(String(vehicleManagement.error));
    }
    
    return (
      <VehicleErrorBoundary 
        error={errorObj} 
        onRetry={vehicleManagement.retryLastOperation}
        retryCount={vehicleManagement.retryCount}
      />
    );
  }

  if (vehicleManagement.isLoading) {
    return <FastLoadingFallback message="Načítání vozidel..." />;
  }

  const {
    vehicles,
    selectedVehicle,
    selectedVehicleId,
    isSaving,
    selectVehicle
  } = vehicleManagement;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <div className="container max-w-7xl py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Vozidla
            </h1>
            <p className="text-lg text-muted-foreground">
              Správa vašich vozidel, spotřeby a dokumentů
            </p>
          </motion.div>

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
              {/* Header with Vehicle selector and Add Button */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex-1"
                >
                  <VehicleSelectorOptimized
                    vehicles={vehicles}
                    selectedVehicleId={selectedVehicleId}
                    onSelect={selectVehicle}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    className="w-full max-w-md"
                  />
                </motion.div>
                
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
              
              {selectedVehicle && selectedVehicleId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <VehicleCarousel
                    selectedVehicle={selectedVehicle}
                    vehicleId={selectedVehicleId}
                  />
                </motion.div>
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
                  onSubmit={handleAddVehicle}
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
                  onSubmit={handleEditVehicle}
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
            onConfirm={handleDeleteVehicle}
            vehicle={deletingVehicle}
            isLoading={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleMainContainer;
