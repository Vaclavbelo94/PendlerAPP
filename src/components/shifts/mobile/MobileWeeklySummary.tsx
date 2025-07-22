import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp } from 'lucide-react';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';

interface MobileWeeklySummaryProps {
  shifts: Shift[];
  weekNumber: string;
  weekRange: string;
}

const MobileWeeklySummary: React.FC<MobileWeeklySummaryProps> = ({
  shifts,
  weekNumber,
  weekRange
}) => {
  const { t } = useTranslation('shifts');

  const calculateStats = () => {
    const stats = {
      morning: 0,
      afternoon: 0,
      night: 0,
      custom: 0,
      free: 0,
      totalOvertime: 0
    };

    // Count 7 days in a week, subtract shifts to get free days
    stats.free = 7 - shifts.length;

    shifts.forEach(shift => {
      switch (shift.type) {
        case 'morning':
          stats.morning++;
          break;
        case 'afternoon':
          stats.afternoon++;
          break;
        case 'night':
          stats.night++;
          break;
        case 'custom':
          stats.custom++;
          break;
      }

      // Calculate overtime for each shift
      if (shift.start_time && shift.end_time) {
        const start = new Date(`1970-01-01T${shift.start_time}`);
        const end = new Date(`1970-01-01T${shift.end_time}`);
        
        if (end < start) {
          end.setDate(end.getDate() + 1);
        }
        
        const diffMs = end.getTime() - start.getTime();
        const hours = diffMs / (1000 * 60 * 60);
        const overtime = Math.max(0, hours - 8);
        stats.totalOvertime += overtime;
      }
    });

    return stats;
  };

  const stats = calculateStats();

  const StatItem: React.FC<{ 
    label: string; 
    value: number; 
    color?: string;
    suffix?: string;
  }> = ({ label, value, color = "text-muted-foreground", suffix = "×" }) => (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className={`font-semibold ${color}`}>
        {value}{suffix}
      </span>
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4" />
          {t('summary')} - {t('weeklyView')} {weekNumber}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{weekRange}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <StatItem 
          label={t('morningShifts')}
          value={stats.morning}
          color="text-yellow-600 dark:text-yellow-400"
        />
        <StatItem 
          label={t('afternoonShifts')}
          value={stats.afternoon}
          color="text-orange-600 dark:text-orange-400"
        />
        <StatItem 
          label={t('nightShifts')}
          value={stats.night}
          color="text-blue-600 dark:text-blue-400"
        />
        <StatItem 
          label={t('noShift')}
          value={stats.free}
          color="text-gray-600 dark:text-gray-400"
        />
        
        {stats.totalOvertime > 0 && (
          <>
            <hr className="my-2" />
            <StatItem 
              label={t('overtime')}
              value={Math.round(stats.totalOvertime * 10) / 10}
              color="text-orange-600 dark:text-orange-400"
              suffix=" h"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileWeeklySummary;