
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { useVehicleManagement } from '@/hooks/vehicle/useVehicleManagement';
import { VehicleData } from '@/types/vehicle';
import VehiclePageContent from './VehiclePageContent';
import VehicleErrorBoundary from './VehicleErrorBoundary';
import FastLoadingFallback from '@/components/common/FastLoadingFallback';

const VehicleMainContainer: React.FC = () => {
  const { user, isInitialized } = useSimplifiedAuth();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

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
    return (
      <VehicleErrorBoundary 
        error={vehicleManagement.error} 
        onRetry={vehicleManagement.retryLastOperation}
        retryCount={vehicleManagement.retryCount}
      />
    );
  }

  if (vehicleManagement.isLoading) {
    return <FastLoadingFallback message="Načítání vozidel..." />;
  }

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VehiclePageContent
              vehicleManagement={vehicleManagement}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isAddSheetOpen={isAddSheetOpen}
              setIsAddSheetOpen={setIsAddSheetOpen}
              isEditSheetOpen={isEditSheetOpen}
              setIsEditSheetOpen={setIsEditSheetOpen}
              isDeleteDialogOpen={isDeleteDialogOpen}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              editingVehicle={editingVehicle}
              setEditingVehicle={setEditingVehicle}
              deletingVehicle={deletingVehicle}
              setDeletingVehicle={setDeletingVehicle}
              onAddVehicle={handleAddVehicle}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onOpenEditDialog={openEditDialog}
              onOpenDeleteDialog={openDeleteDialog}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VehicleMainContainer;
