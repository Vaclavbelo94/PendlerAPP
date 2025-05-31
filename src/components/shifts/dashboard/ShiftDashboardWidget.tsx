
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus } from 'lucide-react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { cs } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';

interface ShiftDashboardWidgetProps {
  shifts: Shift[];
}

export const ShiftDashboardWidget: React.FC<ShiftDashboardWidgetProps> = ({ shifts }) => {
  const navigate = useNavigate();

  const upcomingShifts = React.useMemo(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    return shifts
      .filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= today && shiftDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [shifts]);

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
      case 'morning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'afternoon': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'night': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Dnes';
    if (isTomorrow(date)) return 'Zítra';
    return format(date, 'dd.MM.', { locale: cs });
  };

  if (upcomingShifts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Nadcházející směny
          </CardTitle>
          <CardDescription>Vaše směny na příští týden</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground mb-4">Žádné nadcházející směny</p>
          <Button onClick={() => navigate('/shifts')} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Přidat směnu
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Nadcházející směny
        </CardTitle>
        <CardDescription>Vaše směny na příští týden</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingShifts.map((shift) => (
          <div key={shift.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">
                {getDateLabel(shift.date)}
              </div>
              <Badge className={getShiftTypeColor(shift.type)}>
                {getShiftTypeLabel(shift.type)}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              8h
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate('/shifts')}
          >
            Zobrazit všechny směny
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
