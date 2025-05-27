
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Shift } from '@/hooks/useShiftsManagement';

interface ShiftsAnalyticsProps {
  shifts: Shift[];
}

const ShiftsAnalytics: React.FC<ShiftsAnalyticsProps> = ({ shifts }) => {
  const getShiftTypeData = () => {
    const types = shifts.reduce((acc, shift) => {
      acc[shift.type] = (acc[shift.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Ranní', value: types.morning || 0, color: '#f59e0b' },
      { name: 'Odpolední', value: types.afternoon || 0, color: '#3b82f6' },
      { name: 'Noční', value: types.night || 0, color: '#8b5cf6' }
    ];
  };

  const getMonthlyData = () => {
    const monthly = shifts.reduce((acc, shift) => {
      const month = new Date(shift.date).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthly).map(([month, count]) => ({
      month,
      count
    }));
  };

  const shiftTypeData = getShiftTypeData();
  const monthlyData = getMonthlyData();
  const totalShifts = shifts.length;

  const getMostCommonShiftType = () => {
    const maxType = shiftTypeData.reduce((max, current) => 
      current.value > max.value ? current : max, shiftTypeData[0]
    );
    return maxType?.name || 'Žádná';
  };

  if (shifts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Žádná data pro analýzu</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
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
            <CardTitle className="text-sm font-medium">Nejčastější typ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getMostCommonShiftType()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tento měsíc</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shifts.filter(shift => {
                const shiftDate = new Date(shift.date);
                const now = new Date();
                return shiftDate.getMonth() === now.getMonth() && 
                       shiftDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shift Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rozdělení typů směn</CardTitle>
            <CardDescription>
              Poměr jednotlivých typů směn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={shiftTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {shiftTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Shifts */}
        <Card>
          <CardHeader>
            <CardTitle>Směny podle měsíců</CardTitle>
            <CardDescription>
              Počet směn v jednotlivých měsících
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShiftsAnalytics;
