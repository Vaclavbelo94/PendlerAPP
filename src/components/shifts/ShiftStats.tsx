
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, TrendingUp, TimerIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { calculateShiftStatistics } from '@/utils/overtimeCalculations';
import { Shift } from '@/types/shifts';

interface ShiftStatsProps {
  shifts: Shift[];
}

const ShiftStats = ({ shifts }: ShiftStatsProps) => {
  const { t } = useTranslation('shifts');
  
  // Použij novou utilitu pro výpočet statistik včetně přesčasů
  const stats = calculateShiftStatistics(shifts);
  
  const shiftTypeStats = shifts.reduce((acc, shift) => {
    acc[shift.type] = (acc[shift.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getShiftTypeName = (type: string) => {
    switch (type) {
      case 'morning': return t('morning');
      case 'afternoon': return t('afternoon');
      case 'night': return t('night');
      default: return type;
    }
  };

  const chartData = Object.entries(shiftTypeStats).map(([type, count]) => ({
    name: getShiftTypeName(type),
    count
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalShifts')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShifts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalHours')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">
              {t('standardHours')}: {stats.totalStandardHours}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalOvertime')}</CardTitle>
            <TimerIcon className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.totalOvertime.toFixed(1)}h
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.totalOvertime > 0 ? t('overtime') : t('noOvertime')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('averagePerShift')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageHoursPerShift.toFixed(1)}h</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('shiftTypeDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {Object.keys(stats.overtimeByType).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('overtimeByType')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.overtimeByType).map(([type, overtime]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{getShiftTypeName(type)}</span>
                    <span className="text-sm font-bold text-amber-600">
                      {overtime.toFixed(1)}h
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShiftStats;
