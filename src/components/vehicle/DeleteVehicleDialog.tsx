
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
  const { t } = useTranslation(['vehicle']);

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
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? `${t('vehicle:delete')}...` : t('vehicle:deleteVehicle')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVehicleDialog;
