
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';
import { useTranslation } from 'react-i18next';

interface OptimizedShiftCalendarProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
  onAddShift?: () => void;
  onAddShiftForDate?: (date: Date) => void;
  selectedDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
}

const OptimizedShiftCalendar: React.FC<OptimizedShiftCalendarProps> = ({
  shifts,
  onEditShift,
  onDeleteShift,
  onAddShift,
  onAddShiftForDate,
  selectedDate,
  onDateChange
}) => {
  const { t } = useTranslation('shifts');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Kalendář směn
          </CardTitle>
          {onAddShift && (
            <Button onClick={onAddShift} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Přidat směnu
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {shifts.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Zatím nemáte naplánované žádné směny</p>
            {onAddShift && (
              <Button onClick={onAddShift} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Přidat první směnu
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div>
                  <div className="font-medium">
                    {new Date(shift.date).toLocaleDateString('cs-CZ')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {shift.type} směna
                    {shift.notes && ` • ${shift.notes}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditShift(shift)}
                  >
                    Upravit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shift.id && onDeleteShift(shift.id)}
                  >
                    Smazat
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

export default OptimizedShiftCalendar;
