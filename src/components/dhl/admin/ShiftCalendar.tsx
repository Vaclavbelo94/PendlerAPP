import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar,
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  Plus,
  Filter,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Shift {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  type: string;
  user_id: string;
  notes?: string;
  employee_email?: string;
}

interface CalendarDay {
  date: string;
  shifts: Shift[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

const ShiftCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShiftsForMonth();
  }, [currentDate]);

  const loadShiftsForMonth = async () => {
    try {
      setLoading(true);
      
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      // Get shifts for the month with employee data
      const { data: shifts, error } = await supabase
        .from('shifts')
        .select(`
          *,
          profiles!inner(email)
        `)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])
        .eq('profiles.is_dhl_employee', true);

      if (error) throw error;

      // Generate calendar days
      const firstDayOfWeek = new Date(startOfMonth);
      firstDayOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay() + 1); // Start from Monday

      const lastDayOfWeek = new Date(endOfMonth);
      lastDayOfWeek.setDate(endOfMonth.getDate() + (7 - endOfMonth.getDay()));

      const days: CalendarDay[] = [];
      const currentDay = new Date(firstDayOfWeek);
      const today = new Date();

      while (currentDay <= lastDayOfWeek) {
        const dateStr = currentDay.toISOString().split('T')[0];
        const dayShifts = (shifts || [])
          .filter((shift: any) => shift.date === dateStr)
          .map((shift: any) => ({
            ...shift,
            employee_email: shift.profiles?.email
          }));

        days.push({
          date: dateStr,
          shifts: dayShifts,
          isCurrentMonth: currentDay.getMonth() === currentDate.getMonth(),
          isToday: currentDay.toDateString() === today.toDateString()
        });

        currentDay.setDate(currentDay.getDate() + 1);
      }

      setCalendarDays(days);
    } catch (error) {
      console.error('Error loading shifts:', error);
      toast.error('Chyba při načítání směn');
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getShiftTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ranni': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'odpoledni': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'nocni': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ranni': return 'R';
      case 'odpoledni': return 'O';
      case 'nocni': return 'N';
      default: return type.charAt(0).toUpperCase();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
                Kalendář směn
              </CardTitle>
              <CardDescription>
                Přehled plánovaných směn pro {currentDate.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtr
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                <Plus className="h-4 w-4 mr-2" />
                Přidat směnu
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const dayNum = new Date(day.date).getDate();
                
                return (
                  <div
                    key={day.date}
                    onClick={() => setSelectedDay(day)}
                    className={`
                      min-h-[80px] p-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors
                      ${day.isCurrentMonth ? 'bg-background' : 'bg-muted/20 text-muted-foreground'}
                      ${day.isToday ? 'ring-2 ring-yellow-500' : ''}
                    `}
                  >
                    <div className="text-sm font-medium mb-1">{dayNum}</div>
                    <div className="space-y-1">
                      {day.shifts.slice(0, 3).map((shift, index) => (
                        <div
                          key={`${shift.id}-${index}`}
                          className={`
                            text-xs px-1 py-0.5 rounded text-center font-medium
                            ${getShiftTypeColor(shift.type)}
                          `}
                        >
                          {getShiftTypeLabel(shift.type)}
                        </div>
                      ))}
                      {day.shifts.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{day.shifts.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Detail Dialog */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Směny pro {selectedDay?.date && new Date(selectedDay.date).toLocaleDateString('cs-CZ')}
            </DialogTitle>
            <DialogDescription>
              Zobrazeno {selectedDay?.shifts.length || 0} směn pro tento den
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedDay?.shifts.length ? (
              selectedDay.shifts.map((shift) => (
                <div key={shift.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getShiftTypeColor(shift.type)}>
                      {shift.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {shift.start_time} - {shift.end_time}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-3 w-3" />
                    <span>{shift.employee_email}</span>
                  </div>
                  
                  {shift.notes && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {shift.notes}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Žádné směny pro tento den</p>
              </div>
            )}
            
            <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
              <Plus className="h-4 w-4 mr-2" />
              Přidat směnu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShiftCalendar;