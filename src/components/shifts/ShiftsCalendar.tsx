
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Shift } from '@/hooks/useShiftsManagement';
import { cn } from '@/lib/utils';

interface ShiftsCalendarProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

const ShiftsCalendar: React.FC<ShiftsCalendarProps> = ({
  shifts,
  onEditShift,
  onDeleteShift
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty days for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getShiftsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(shift => shift.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('cs-CZ', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Kalendář směn
              </CardTitle>
              <CardDescription>
                Přehled vašich směn v kalendáři
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium min-w-[180px] text-center">
                {monthYear}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map(day => (
              <div 
                key={day}
                className="p-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2 h-24" />;
              }
              
              const dayShifts = getShiftsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={date.toISOString()}
                  className={cn(
                    "p-2 h-24 border rounded-lg hover:bg-accent/50 transition-colors",
                    isToday && "ring-2 ring-primary"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "text-sm",
                      isToday ? "font-bold text-primary" : "text-muted-foreground"
                    )}>
                      {date.getDate()}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {dayShifts.map(shift => (
                      <div
                        key={shift.id}
                        className={cn(
                          "text-xs px-1 py-0.5 rounded cursor-pointer",
                          shift.type === 'morning' ? 'bg-orange-100 text-orange-800' :
                          shift.type === 'afternoon' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        )}
                        onClick={() => onEditShift(shift)}
                      >
                        {shift.type === 'morning' ? 'Ranní' :
                         shift.type === 'afternoon' ? 'Odpoledne' : 'Noční'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent shifts list */}
      <Card>
        <CardHeader>
          <CardTitle>Nadcházející směny</CardTitle>
          <CardDescription>
            Seznam vašich příštích pracovních směn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Zatím nemáte naplánované žádné směny</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shifts.slice(0, 5).map(shift => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => onEditShift(shift)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      shift.type === 'morning' ? 'bg-orange-500' :
                      shift.type === 'afternoon' ? 'bg-blue-500' : 'bg-purple-500'
                    )} />
                    <div>
                      <p className="font-medium">
                        {new Date(shift.date).toLocaleDateString('cs-CZ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {shift.type === 'morning' ? 'Ranní směna' :
                         shift.type === 'afternoon' ? 'Odpolední směna' : 'Noční směna'}
                      </p>
                    </div>
                  </div>
                  {shift.notes && (
                    <p className="text-sm text-muted-foreground max-w-xs truncate">
                      {shift.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftsCalendar;
