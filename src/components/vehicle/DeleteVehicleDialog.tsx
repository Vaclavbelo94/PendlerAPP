
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { VehicleData } from '@/types/vehicle';

interface DeleteVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vehicle: VehicleData | null;
  isLoading: boolean;
}

const DeleteVehicleDialog: React.FC<DeleteVehicleDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  vehicle,
  isLoading
}) => {
  if (!vehicle) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Smazat vozidlo</AlertDialogTitle>
          <AlertDialogDescription>
            Opravdu chcete smazat vozidlo <strong>{vehicle.brand} {vehicle.model}</strong> ({vehicle.license_plate})?
            <br />
            <br />
            Tato akce je nevratná a smaže všechny související záznamy včetně tankování, servisů a dokumentů.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Zrušit
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Mazání...' : 'Smazat vozidlo'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVehicleDialog;
