
import React, { useState } from 'react';
import { useSimplifiedAuth } from '@/hooks/auth/useSimplifiedAuth';
import { useVehicleManagement } from '@/hooks/vehicle/useVehicleManagement';
import { useVehiclePageState } from '@/hooks/vehicle/useVehiclePageState';
import VehicleErrorBoundary from './VehicleErrorBoundary';
import FastLoadingFallback from '@/components/common/FastLoadingFallback';
import VehiclePageHeader from './VehiclePageHeader';
import VehiclePageContent from './VehiclePageContent';
import VehicleSheets from './VehicleSheets';

const VehicleMainContainer: React.FC = () => {
  const { user, isInitialized } = useSimplifiedAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const vehicleManagement = useVehicleManagement(user?.id);
  const {
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
    openEditDialog,
    openDeleteDialog,
    closeEditSheet,
    closeDeleteDialog
  } = useVehiclePageState();

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
      closeEditSheet();
    }
  };

  const handleDeleteVehicle = async () => {
    if (!deletingVehicle?.id) return;
    
    await vehicleManagement.removeVehicle(deletingVehicle.id);
    closeDeleteDialog();
  };

  if (!isInitialized) {
    return <FastLoadingFallback message="Inicializace..." />;
  }

  if (vehicleManagement.error && !vehicleManagement.isLoading) {
    // Safely convert error to Error object with proper null handling
    const error = vehicleManagement.error;
    if (!error) {
      return <FastLoadingFallback message="Načítání vozidel..." />;
    }
    
    let errorObj: Error;
    if (typeof error === 'string') {
      errorObj = new Error(error);
    } else {
      errorObj = new Error(String(error));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/5">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <div className="container max-w-7xl py-8 px-4">
          <VehiclePageHeader />
          
          <VehiclePageContent
            vehicleManagement={vehicleManagement}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddVehicle={() => setIsAddSheetOpen(true)}
            onOpenEditDialog={openEditDialog}
            onOpenDeleteDialog={openDeleteDialog}
          />
          
          <VehicleSheets
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
            isSaving={vehicleManagement.isSaving}
            onAddVehicle={handleAddVehicle}
            onEditVehicle={handleEditVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleMainContainer;
