
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Calendar as CalendarIcon, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { cn } from '@/lib/utils';

interface MobileShiftDetailsProps {
  selectedDate?: Date;
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

export const MobileShiftDetails: React.FC<MobileShiftDetailsProps> = ({
  selectedDate,
  shifts,
  onEditShift,
  onDeleteShift
}) => {
  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning':
        return 'Ranní směna';
      case 'afternoon':
        return 'Odpolední směna';
      case 'night':
        return 'Noční směna';
      default:
        return type;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'afternoon':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'night':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getShiftTime = (type: string) => {
    switch (type) {
      case 'morning':
        return '6:00 - 14:00';
      case 'afternoon':
        return '14:00 - 22:00';
      case 'night':
        return '22:00 - 6:00';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {selectedDate ? format(selectedDate, 'EEEE, d. MMMM yyyy', { locale: cs }) : 'Vyberte datum'}
        </CardTitle>
        <CardDescription>
          {shifts.length > 0 
            ? `${shifts.length} směna${shifts.length > 1 ? 'y' : ''}`
            : 'Žádné směny'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {shifts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Na tento den nemáte naplánované žádné směny</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="flex flex-col space-y-3 p-4 border rounded-lg bg-card"
              >
                {/* Shift info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={cn("font-medium", getShiftTypeColor(shift.type))}
                      >
                        {getShiftTypeLabel(shift.type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getShiftTime(shift.type)}
                      </span>
                    </div>
                    
                    {shift.notes && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <p className="break-words">{shift.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditShift(shift)}
                    className="flex-1 h-10"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Upravit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => shift.id && onDeleteShift(shift.id)}
                    className="h-10 px-4"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
