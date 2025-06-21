
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
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteVehicle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('confirmDelete')}{' '}
            <strong>
              {vehicle?.brand} {vehicle?.model} ({vehicle?.license_plate})
            </strong>
            ? {t('deleteConfirmation')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? `${t('delete')}...` : t('deleteVehicle')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVehicleDialog;
