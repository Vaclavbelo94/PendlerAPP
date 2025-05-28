
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BulkActionButtonsProps {
  selectedCount: number;
  onBulkEdit: (shiftIds: string[]) => void;
  onBulkDelete: (shiftIds: string[]) => void;
  selectedShifts: string[];
}

export const BulkActionButtons: React.FC<BulkActionButtonsProps> = ({
  selectedCount,
  onBulkEdit,
  onBulkDelete,
  selectedShifts
}) => {
  if (selectedCount === 0) return null;

  return (
    <CardContent className="pt-0">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkEdit(selectedShifts)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Upravit vybrané
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Smazat vybrané
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Smazat vybrané směny?</AlertDialogTitle>
              <AlertDialogDescription>
                Opravdu chcete smazat {selectedCount} vybraných směn? 
                Tuto akci nelze vrátit zpět.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Zrušit</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onBulkDelete(selectedShifts)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Smazat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardContent>
  );
};
