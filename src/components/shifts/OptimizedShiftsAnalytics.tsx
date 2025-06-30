
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, Calendar, TrendingUp } from 'lucide-react';
import { Shift } from '@/hooks/shifts/useShiftsCRUD';

interface OptimizedShiftsAnalyticsProps {
  shifts: Shift[];
}

const OptimizedShiftsAnalytics: React.FC<OptimizedShiftsAnalyticsProps> = ({ shifts }) => {
  const totalShifts = shifts.length;
  const morningShifts = shifts.filter(s => s.type === 'morning').length;
  const afternoonShifts = shifts.filter(s => s.type === 'afternoon').length;
  const nightShifts = shifts.filter(s => s.type === 'night').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">Ranní směny</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{morningShifts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Odpolední směny</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{afternoonShifts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Noční směny</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nightShifts}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Přehled směn podle typu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalShifts === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Zatím nemáte dostatek dat pro analýzu
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Ranní směny</span>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-200 h-2 rounded-full flex-1 min-w-[100px]">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(morningShifts / totalShifts) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((morningShifts / totalShifts) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Odpolední směny</span>
                <div className="flex items-center gap-2">
                  <div className="bg-amber-200 h-2 rounded-full flex-1 min-w-[100px]">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${(afternoonShifts / totalShifts) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((afternoonShifts / totalShifts) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Noční směny</span>
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-200 h-2 rounded-full flex-1 min-w-[100px]">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${(nightShifts / totalShifts) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((nightShifts / totalShifts) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedShiftsAnalytics;
