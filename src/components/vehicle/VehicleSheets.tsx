
import React from 'react';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from '@/components/ui/sheet';
import { Car } from 'lucide-react';
import { VehicleData } from '@/types/vehicle';
import VehicleForm from './VehicleForm';
import DeleteVehicleDialog from './DeleteVehicleDialog';

interface VehicleSheetsProps {
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
  isSaving: boolean;
  onAddVehicle: (formData: any) => Promise<void>;
  onEditVehicle: (formData: any) => Promise<void>;
  onDeleteVehicle: () => Promise<void>;
}

const VehicleSheets: React.FC<VehicleSheetsProps> = ({
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
  isSaving,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle
}) => {
  return (
    <>
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
    </>
  );
};

export default VehicleSheets;
