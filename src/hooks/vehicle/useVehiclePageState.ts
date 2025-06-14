
import { useState } from 'react';
import { VehicleData } from '@/types/vehicle';

export const useVehiclePageState = () => {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleData | null>(null);

  const openEditDialog = (vehicle: VehicleData) => {
    setEditingVehicle(vehicle);
    setIsEditSheetOpen(true);
  };

  const openDeleteDialog = (vehicle: VehicleData) => {
    setDeletingVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const closeEditSheet = () => {
    setIsEditSheetOpen(false);
    setEditingVehicle(null);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingVehicle(null);
  };

  return {
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
  };
};
