
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock, TrendingUp, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';

interface OptimizedShiftsAnalyticsProps {
  shifts: Shift[];
}

const OptimizedShiftsAnalytics: React.FC<OptimizedShiftsAnalyticsProps> = ({ shifts }) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const currentMonth = {
      start: startOfMonth(now),
      end: endOfMonth(now)
    };
    
    const currentWeek = {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 })
    };

    const thisMonthShifts = shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= currentMonth.start && shiftDate <= currentMonth.end;
    });

    const thisWeekShifts = shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= currentWeek.start && shiftDate <= currentWeek.end;
    });

    const shiftTypeCount = shifts.reduce((acc, shift) => {
      acc[shift.type] = (acc[shift.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalHours = shifts.length * 8; // Předpokládáme 8h směny
    const monthlyHours = thisMonthShifts.length * 8;
    const weeklyHours = thisWeekShifts.length * 8;

    // Průměrné směny za týden
    const weeksWithShifts = Math.max(1, Math.ceil(shifts.length / 4)); // Hrubý odhad
    const avgShiftsPerWeek = shifts.length / weeksWithShifts;

    return {
      total: {
        shifts: shifts.length,
        hours: totalHours
      },
      thisMonth: {
        shifts: thisMonthShifts.length,
        hours: monthlyHours
      },
      thisWeek: {
        shifts: thisWeekShifts.length,
        hours: weeklyHours
      },
      byType: shiftTypeCount,
      averages: {
        shiftsPerWeek: avgShiftsPerWeek,
        hoursPerWeek: avgShiftsPerWeek * 8
      }
    };
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

  return (
    <div className="space-y-6">
      {/* Celkové statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkem směn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total.shifts}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.total.hours} hodin celkem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tento měsíc</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.thisMonth.shifts}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.thisMonth.hours} hodin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tento týden</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.thisWeek.shifts}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.thisWeek.hours} hodin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Průměr/týden</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averages.shiftsPerWeek.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.averages.hoursPerWeek.toFixed(0)} hodin/týden
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analýza podle typu směn */}
      <Card>
        <CardHeader>
          <CardTitle>Rozdělení podle typu směn</CardTitle>
          <CardDescription>
            Přehled vašich směn podle typu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(analytics.byType).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(analytics.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getShiftTypeColor(type)}>
                      {getShiftTypeLabel(type)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground">
                      {((count / analytics.total.shifts) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Žádná data pro analýzu</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nedávná aktivita */}
      <Card>
        <CardHeader>
          <CardTitle>Nedávné směny</CardTitle>
          <CardDescription>
            Vaše poslední směny
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shifts.length > 0 ? (
            <div className="space-y-3">
              {shifts
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Badge className={getShiftTypeColor(shift.type)}>
                        {getShiftTypeLabel(shift.type)}
                      </Badge>
                      <span className="text-sm">
                        {format(new Date(shift.date), 'dd.MM.yyyy', { locale: cs })}
                      </span>
                    </div>
                    {shift.notes && (
                      <span className="text-sm text-muted-foreground">
                        {shift.notes}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Žádné směny k zobrazení</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedShiftsAnalytics;
