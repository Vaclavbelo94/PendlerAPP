
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Edit, 
  Calendar, 
  Upload, 
  Download,
  CheckSquare,
  X
} from 'lucide-react';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
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

interface BulkOperationsProps {
  shifts: Shift[];
  selectedShifts: string[];
  onShiftSelect: (shiftId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: (shiftIds: string[]) => void;
  onBulkEdit: (shiftIds: string[]) => void;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({
  shifts,
  selectedShifts,
  onShiftSelect,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkEdit
}) => {
  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return 'Ranní';
      case 'afternoon': return 'Odpolední'; 
      case 'night': return 'Noční';
      default: return type;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-orange-100 text-orange-800';
      case 'afternoon': return 'bg-blue-100 text-blue-800';
      case 'night': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Selection Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Hromadné operace
              {selectedShifts.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedShifts.length} vybráno
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex gap-2">
              {selectedShifts.length === 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSelectAll}
                  className="flex items-center gap-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  Vybrat vše
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearSelection}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Zrušit výběr
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {selectedShifts.length > 0 && (
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
                      Opravdu chcete smazat {selectedShifts.length} vybraných směn? 
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
        )}
      </Card>

      {/* Shifts List with Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Seznam směn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {shifts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Žádné směny k zobrazení
            </p>
          ) : (
            shifts.map((shift) => (
              <div
                key={shift.id}
                className={`
                  flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors
                  ${selectedShifts.includes(shift.id!) 
                    ? 'bg-primary/5 border-primary' 
                    : 'hover:bg-muted/50'
                  }
                `}
                onClick={() => shift.id && onShiftSelect(shift.id)}
              >
                <Checkbox
                  checked={selectedShifts.includes(shift.id!)}
                  onChange={() => shift.id && onShiftSelect(shift.id)}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {format(new Date(shift.date), 'EEEE, d. MMMM yyyy', { locale: cs })}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={getShiftTypeColor(shift.type)}
                    >
                      {getShiftTypeLabel(shift.type)}
                    </Badge>
                  </div>
                  {shift.notes && (
                    <p className="text-sm text-muted-foreground truncate">
                      {shift.notes}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOperations;
