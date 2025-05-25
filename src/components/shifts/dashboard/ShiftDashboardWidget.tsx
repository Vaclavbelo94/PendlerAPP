
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface ShiftDashboardWidgetProps {
  shifts: Array<{
    date: Date;
    type: string;
    notes?: string;
  }>;
}

export const ShiftDashboardWidget: React.FC<ShiftDashboardWidgetProps> = ({ shifts }) => {
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const getShiftForDay = (date: Date) => {
    return shifts.find(shift => isSameDay(shift.date, date));
  };

  const getShiftTypeIcon = (type: string) => {
    switch (type) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'night': return '🌙';
      default: return '⏰';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Týdenní rozvrh
            </CardTitle>
            <CardDescription>
              {format(weekStart, 'd. MMM', { locale: cs })} - {format(weekEnd, 'd. MMM yyyy', { locale: cs })}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {weekDays.map((day, index) => {
          const shift = getShiftForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                isToday ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-center min-w-[3rem]">
                  <div className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                    {format(day, 'EEE', { locale: cs })}
                  </div>
                  <div className={`text-lg ${isToday ? 'text-primary font-bold' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>
                <div className="flex-1">
                  {shift ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getShiftTypeIcon(shift.type)}</span>
                      <div>
                        <div className="font-medium text-sm">
                          {shift.type === 'morning' ? 'Ranní (6:00)' : 
                           shift.type === 'afternoon' ? 'Odpolední (14:00)' : 'Noční (22:00)'}
                        </div>
                        {shift.notes && (
                          <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {shift.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Volno</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 border-t">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/shifts">
              Zobrazit celý kalendář
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
