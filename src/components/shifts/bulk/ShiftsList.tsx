
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { ShiftItem } from './ShiftItem';

interface ShiftsListProps {
  shifts: Shift[];
  selectedShifts: string[];
  onShiftSelect: (shiftId: string) => void;
}

export const ShiftsList: React.FC<ShiftsListProps> = ({
  shifts,
  selectedShifts,
  onShiftSelect
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
            <ShiftItem
              key={shift.id}
              shift={shift}
              isSelected={selectedShifts.includes(shift.id!)}
              onSelect={onShiftSelect}
              getShiftTypeLabel={getShiftTypeLabel}
              getShiftTypeColor={getShiftTypeColor}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
