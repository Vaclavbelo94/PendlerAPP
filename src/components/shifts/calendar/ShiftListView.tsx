
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, isSameMonth, parseISO } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { Shift } from '@/types/shifts';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ShiftListViewProps {
  shifts: Shift[];
  onEditShift?: (shift: Shift) => void;
  onDeleteShift?: (shiftId: string) => void;
  onAddShift: (date?: Date) => void;
  isLoading?: boolean;
}

const ShiftListView: React.FC<ShiftListViewProps> = ({
  shifts,
  onEditShift,
  onDeleteShift,
  onAddShift,
  isLoading = false
}) => {
  const { t, i18n } = useTranslation('shifts');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get locale for date-fns based on current language
  const getLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      default: return cs;
    }
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return t('morningShift') || 'Ranní směna';
      case 'afternoon': return t('afternoonShift') || 'Odpolední směna';
      case 'night': return t('nightShift') || 'Noční směna';
      case 'custom': return t('customShift') || 'Vlastní směna';
      default: return type;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-blue-500';
      case 'afternoon': return 'bg-amber-500';
      case 'night': return 'bg-indigo-500';
      case 'custom': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const monthlyShifts = shifts.filter(shift => {
    const shiftDate = parseISO(shift.date);
    return isSameMonth(shiftDate, currentMonth);
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: getLocale() })}
        </h3>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Add shift button */}
      <Button
        onClick={() => onAddShift()}
        className="w-full flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {t('addShift') || 'Přidat směnu'}
      </Button>

      {/* Shifts list */}
      {monthlyShifts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t('noShiftsInMonth') || 'Žádné směny v tomto měsíci'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {monthlyShifts.map((shift) => (
            <Card key={shift.id} className="border-l-4 border-l-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Date */}
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      {format(parseISO(shift.date), "EEEE, d. MMMM yyyy", { locale: getLocale() })}
                    </div>
                    
                    {/* Shift info */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <div className={cn("w-3 h-3 rounded", getShiftTypeColor(shift.type))}></div>
                        {getShiftTypeLabel(shift.type)}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="font-mono">{shift.start_time} - {shift.end_time}</span>
                      </div>
                    </div>
                    
                    {/* Notes */}
                    {shift.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {shift.notes}
                      </p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    {onEditShift && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditShift(shift)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    {onDeleteShift && shift.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteShift(shift.id!)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShiftListView;
