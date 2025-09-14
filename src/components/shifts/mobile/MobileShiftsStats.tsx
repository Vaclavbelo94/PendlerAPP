import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shift } from '@/types/shifts';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { useOvertimeData } from '@/hooks/useOvertimeData';
import { useAuth } from '@/hooks/auth';

interface MobileShiftsStatsProps {
  shifts: Shift[];
  currentDate: Date;
}

const MobileShiftsStats: React.FC<MobileShiftsStatsProps> = ({
  shifts,
  currentDate
}) => {
  const { t } = useTranslation('shifts');
  const { user } = useAuth();
  
  // Get proper overtime calculation for current month
  const { overtimeData } = useOvertimeData({
    userId: user?.id,
    month: currentDate.getMonth(),
    year: currentDate.getFullYear()
  });

  // Filter shifts for current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  const monthlyShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date + 'T00:00:00');
    return isWithinInterval(shiftDate, { start: monthStart, end: monthEnd });
  });

  // Calculate statistics
  const totalShifts = monthlyShifts.length;
  const morningShifts = monthlyShifts.filter(s => s.type === 'morning').length;
  const afternoonShifts = monthlyShifts.filter(s => s.type === 'afternoon').length;
  const nightShifts = monthlyShifts.filter(s => s.type === 'night').length;
  const customShifts = monthlyShifts.filter(s => s.type === 'custom').length;

  // Calculate total hours and overtime
  const calculateShiftHours = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let start = startHour + startMin / 60;
    let end = endHour + endMin / 60;
    
    // Handle overnight shifts
    if (end < start) {
      end += 24;
    }
    
    return end - start;
  };

  const totalHours = monthlyShifts.reduce((sum, shift) => {
    return sum + calculateShiftHours(shift.start_time, shift.end_time);
  }, 0);

  // Use proper overtime calculation from useOvertimeData hook
  const overtimeHours = overtimeData.total;

  const stats = [
    {
      label: t('totalShifts', 'Celkem směn'),
      value: totalShifts,
      icon: '📅'
    },
    {
      label: t('totalHours', 'Celkem hodin'),
      value: Math.round(totalHours),
      icon: '⏰'
    },
    {
      label: t('mobile.overtimeHours', 'Přesčasy'),
      value: Math.round(overtimeHours),
      icon: '⚡',
      highlight: overtimeHours > 0
    }
  ];

  const shiftTypes = [
    {
      type: 'morning',
      label: t('morning', 'Ranní'),
      count: morningShifts,
      color: 'bg-blue-500',
      icon: '🌅'
    },
    {
      type: 'afternoon',
      label: t('afternoon', 'Odpolední'),
      count: afternoonShifts,
      color: 'bg-orange-500',
      icon: '🌞'
    },
    {
      type: 'night',
      label: t('night', 'Noční'),
      count: nightShifts,
      color: 'bg-purple-500',
      icon: '🌙'
    },
    {
      type: 'custom',
      label: t('customShift', 'Vlastní'),
      count: customShifts,
      color: 'bg-green-500',
      icon: '⚙️'
    }
  ].filter(type => type.count > 0);

  if (totalShifts === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-muted-foreground">
            {t('mobile.noShiftsInMonth', 'Žádné směny v tomto měsíci')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {t('mobile.monthlyStats', 'Měsíční statistiky')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <Badge 
                variant={stat.highlight ? "default" : "secondary"}
                className="font-medium"
              >
                {stat.value}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Shift type breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {t('mobile.shiftBreakdown', 'Rozložení směn')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {shiftTypes.map((type, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${type.color}`} />
                <span className="text-sm">{type.label}</span>
              </div>
              <Badge variant="outline" className="font-medium">
                {type.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileShiftsStats;