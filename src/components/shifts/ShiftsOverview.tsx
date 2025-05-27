
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, TrendingUp, Users } from 'lucide-react';
import { Shift } from '@/hooks/useShiftsManagement';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ShiftsOverviewProps {
  shifts: Shift[];
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (shiftId: string) => void;
}

const ShiftsOverview: React.FC<ShiftsOverviewProps> = ({
  shifts,
  onEditShift,
  onDeleteShift
}) => {
  const isMobile = useIsMobile();

  const getShiftStats = () => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const thisMonthShifts = shifts.filter(shift => 
      new Date(shift.date) >= thisMonth
    );

    const shiftTypes = shifts.reduce((acc, shift) => {
      acc[shift.type] = (acc[shift.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: shifts.length,
      thisMonth: thisMonthShifts.length,
      morningShifts: shiftTypes.morning || 0,
      afternoonShifts: shiftTypes.afternoon || 0,
      nightShifts: shiftTypes.night || 0
    };
  };

  const stats = getShiftStats();

  const statCards = [
    {
      title: 'Celkem směn',
      value: stats.total,
      description: 'Za celou dobu',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Tento měsíc',
      value: stats.thisMonth,
      description: 'Aktuální měsíc',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Ranní směny',
      value: stats.morningShifts,
      description: 'Celkem',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      title: 'Odpolední směny',
      value: stats.afternoonShifts,
      description: 'Celkem',
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  const recentShifts = shifts.slice(0, 5);

  return (
    <div className={cn("space-y-6", isMobile ? "space-y-4" : "")}>
      {/* Statistics Cards */}
      <div className={cn("grid gap-6", isMobile ? "grid-cols-2 gap-4" : "grid-cols-4")}>
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={cn("font-medium", isMobile ? "text-sm" : "text-base")}>
                  {stat.title}
                </CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>
                  {stat.value}
                </div>
                <p className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Shifts */}
      <Card>
        <CardHeader>
          <CardTitle>Poslední směny</CardTitle>
          <CardDescription>
            Přehled vašich posledních pracovních směn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentShifts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Zatím nemáte žádné směny
            </p>
          ) : (
            <div className="space-y-3">
              {recentShifts.map((shift) => (
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

export default ShiftsOverview;
