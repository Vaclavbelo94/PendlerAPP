
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, TrendingUp } from 'lucide-react';

interface Shift {
  id: string;
  date: string;
  type: string;
  hours?: number;
}

interface ShiftStatsProps {
  shifts: Shift[];
}

const ShiftStats = ({ shifts }: ShiftStatsProps) => {
  const totalHours = shifts.reduce((sum, shift) => sum + (shift.hours || 8), 0);
  const totalShifts = shifts.length;
  const averageHours = totalShifts > 0 ? totalHours / totalShifts : 0;

  const shiftTypeStats = shifts.reduce((acc, shift) => {
    acc[shift.type] = (acc[shift.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(shiftTypeStats).map(([type, count]) => ({
    name: type === 'morning' ? 'Ranní' : type === 'afternoon' ? 'Odpolední' : 'Noční',
    count
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkem směn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShifts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkem hodin</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Průměr hodin/směna</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHours.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rozložení typů směn</CardTitle>
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
    </div>
  );
};

export default ShiftStats;
