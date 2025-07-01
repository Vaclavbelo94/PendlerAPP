
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useVehicleManagement } from '@/hooks/vehicle/useVehicleManagement';
import VehiclePageContent from '@/components/vehicle/VehiclePageContent';
import VehicleDialog from '@/components/vehicle/dialogs/VehicleDialog';
import DeleteVehicleDialog from '@/components/vehicle/dialogs/DeleteVehicleDialog';
import { VehicleData } from '@/types/vehicle';
import { useTranslation } from 'react-i18next';

const Vehicle = () => {
  const { t } = useTranslation(['vehicle', 'ui']);
  const { unifiedUser } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleData | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleData | null>(null);

  const vehicleManagement = useVehicleManagement(unifiedUser?.id);

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsAddDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: VehicleData) => {
    setEditingVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicle: VehicleData) => {
    setDeletingVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    vehicleManagement.refreshVehicles();
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingVehicle(null);
  };

  const handleDeleteSuccess = () => {
    vehicleManagement.refreshVehicles();
    setIsDeleteDialogOpen(false);
    setDeletingVehicle(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('vehicle:vehicleManagement')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('vehicle:manageVehiclesDescription')}
            </p>
          </div>
        </div>

        <VehiclePageContent
          vehicleManagement={vehicleManagement}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAddVehicle={handleAddVehicle}
          onOpenEditDialog={handleEditVehicle}
          onOpenDeleteDialog={handleDeleteVehicle}
        />

        {/* Add Vehicle Dialog */}
        <VehicleDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={handleDialogSuccess}
          vehicle={null}
          userId={unifiedUser?.id}
        />

        {/* Edit Vehicle Dialog */}
        <VehicleDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={handleDialogSuccess}
          vehicle={editingVehicle}
          userId={unifiedUser?.id}
        />

        {/* Delete Vehicle Dialog */}
        <DeleteVehicleDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onSuccess={handleDeleteSuccess}
          vehicle={deletingVehicle}
          onDelete={vehicleManagement.removeVehicle}
        />
      </motion.div>
    </div>
  );
};

export default Vehicle;
