
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, CheckSquare, Square } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';

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
      case 'morning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'afternoon': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'night': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const isAllSelected = shifts.length > 0 && selectedShifts.length === shifts.length;
  const isPartiallySelected = selectedShifts.length > 0 && selectedShifts.length < shifts.length;

  return (
    <div className="space-y-6">
      {/* Ovládací panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Hromadné operace</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Vybráno: {selectedShifts.length} z {shifts.length}
            </div>
          </CardTitle>
          <CardDescription>
            Vyberte směny pro hromadné úpravy nebo mazání
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={isAllSelected ? onClearSelection : onSelectAll}
              className="flex items-center gap-2"
            >
              {isAllSelected ? <Square className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
              {isAllSelected ? 'Zrušit výběr' : 'Vybrat vše'}
            </Button>

            {selectedShifts.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkEdit(selectedShifts)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Upravit vybrané
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onBulkDelete(selectedShifts)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Smazat vybrané
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seznam směn */}
      <Card>
        <CardHeader>
          <CardTitle>Seznam směn</CardTitle>
          <CardDescription>
            Klikněte na checkbox pro výběr směn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Žádné směny k zobrazení</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shifts
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((shift) => (
                  <div
                    key={shift.id}
                    className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                      selectedShifts.includes(shift.id!) 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-muted/30'
                    }`}
                  >
                    <Checkbox
                      checked={selectedShifts.includes(shift.id!)}
                      onCheckedChange={() => shift.id && onShiftSelect(shift.id)}
                    />
                    
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {format(new Date(shift.date), 'dd.MM.yyyy', { locale: cs })}
                        </span>
                        <Badge className={getShiftTypeColor(shift.type)}>
                          {getShiftTypeLabel(shift.type)}
                        </Badge>
                        {shift.notes && (
                          <span className="text-sm text-muted-foreground">
                            {shift.notes}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        8 hodin
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOperations;
