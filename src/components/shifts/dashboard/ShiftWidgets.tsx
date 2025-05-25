
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';

interface ShiftWidgetsProps {
  shifts: any[];
}

export const ShiftWidgets: React.FC<ShiftWidgetsProps> = ({ shifts }) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const todayShifts = shifts.filter(shift => 
    isSameDay(new Date(shift.date), today)
  );
  
  const tomorrowShifts = shifts.filter(shift => 
    isSameDay(new Date(shift.date), tomorrow)
  );

  const thisWeekShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const weekEnd = addDays(weekStart, 6);
    return shiftDate >= weekStart && shiftDate <= weekEnd;
  });

  const getShiftTypeIcon = (type: string) => {
    switch (type) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'night': return '🌙';
      default: return '⏰';
    }
  };

  const getShiftTime = (type: string) => {
    switch (type) {
      case 'morning': return '6:00';
      case 'afternoon': return '14:00';
      case 'night': return '22:00';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Today's shift */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Dnes</p>
            {todayShifts.length > 0 ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{getShiftTypeIcon(todayShifts[0].type)}</span>
                <div>
                  <p className="font-medium">{getShiftTime(todayShifts[0].type)}</p>
                  <p className="text-xs text-muted-foreground">
                    {todayShifts[0].type === 'morning' ? 'Ranní' : 
                     todayShifts[0].type === 'afternoon' ? 'Odpolední' : 'Noční'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Žádná směna</p>
            )}
          </div>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* Tomorrow's shift */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Zítra</p>
            {tomorrowShifts.length > 0 ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{getShiftTypeIcon(tomorrowShifts[0].type)}</span>
                <div>
                  <p className="font-medium">{getShiftTime(tomorrowShifts[0].type)}</p>
                  <p className="text-xs text-muted-foreground">
                    {tomorrowShifts[0].type === 'morning' ? 'Ranní' : 
                     tomorrowShifts[0].type === 'afternoon' ? 'Odpolední' : 'Noční'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Žádná směna</p>
            )}
          </div>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* This week total */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tento týden</p>
            <p className="text-2xl font-bold mt-1">{thisWeekShifts.length}</p>
            <p className="text-xs text-muted-foreground">směn</p>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* Quick status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Stav</p>
            <p className="text-sm font-medium mt-1 text-green-600">
              Synchronizováno
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(), 'HH:mm', { locale: cs })}
            </p>
          </div>
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
        </div>
      </Card>
    </div>
  );
};
