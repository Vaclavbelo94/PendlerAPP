
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
import { useTranslation } from 'react-i18next';

interface DeleteVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicle: VehicleData | null;
  onDelete: (vehicleId: string) => Promise<void>;
}

const DeleteVehicleDialog: React.FC<DeleteVehicleDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vehicle,
  onDelete
}) => {
  const { t } = useTranslation(['vehicle']);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!vehicle?.id) return;

    setIsLoading(true);
    try {
      await onDelete(vehicle.id);
      onSuccess();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('vehicle:deleteVehicle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('vehicle:confirmDelete')}{' '}
            <strong>
              {vehicle?.brand} {vehicle?.model} ({vehicle?.license_plate})
            </strong>
            ? {t('vehicle:deleteConfirmation')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{t('vehicle:cancel')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? `${t('vehicle:deleting')}...` : t('vehicle:delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVehicleDialog;
