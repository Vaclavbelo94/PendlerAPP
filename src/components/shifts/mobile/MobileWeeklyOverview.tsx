import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { cs } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';

interface MobileWeeklyOverviewProps {
  weekDays: Date[];
  shifts: Shift[];
  onDayClick: (date: Date) => void;
}

const MobileWeeklyOverview: React.FC<MobileWeeklyOverviewProps> = ({
  weekDays,
  shifts,
  onDayClick
}) => {
  const { t } = useTranslation('shifts');

  const getShiftForDay = (day: Date) => {
    return shifts.find(shift => isSameDay(new Date(shift.date), day));
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'afternoon':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'night':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'custom':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  return (
    <div className="mt-4">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weekDays.map((day) => {
          const shift = getShiftForDay(day);
          const today = isToday(day);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={cn(
                "flex-1 min-w-[45px] p-2 rounded-lg border-2 transition-all",
                today 
                  ? "border-primary bg-primary/10" 
                  : "border-muted hover:border-muted-foreground/30",
                shift && getShiftTypeColor(shift.type)
              )}
            >
              <div className="text-center">
                <div className="text-xs font-medium text-muted-foreground">
                  {format(day, 'EEE', { locale: cs }).toUpperCase()}
                </div>
                <div className={cn(
                  "text-lg font-bold mt-1",
                  today ? "text-primary" : "text-foreground"
                )}>
                  {format(day, 'd')}
                </div>
                {shift && (
                  <div className="text-xs mt-1 font-medium">
                    {shift.type === 'morning' && t('morning')}
                    {shift.type === 'afternoon' && t('afternoon')}
                    {shift.type === 'night' && t('night')}
                    {shift.type === 'custom' && t('customShift')}
                  </div>
                )}
                {!shift && (
                  <div className="text-xs mt-1 text-muted-foreground">
                    {t('noShift')}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileWeeklyOverview;