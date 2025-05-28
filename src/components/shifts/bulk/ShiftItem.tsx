
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface ShiftItemProps {
  shift: Shift;
  isSelected: boolean;
  onSelect: (shiftId: string) => void;
  getShiftTypeLabel: (type: string) => string;
  getShiftTypeColor: (type: string) => string;
}

export const ShiftItem: React.FC<ShiftItemProps> = ({
  shift,
  isSelected,
  onSelect,
  getShiftTypeLabel,
  getShiftTypeColor
}) => {
  const handleClick = () => {
    if (shift.id) {
      onSelect(shift.id);
    }
  };

  return (
    <div
      className={`
        flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors
        ${isSelected 
          ? 'bg-primary/5 border-primary' 
          : 'hover:bg-muted/50'
        }
      `}
      onClick={handleClick}
    >
      <Checkbox
        checked={isSelected}
        onChange={handleClick}
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
  );
};
