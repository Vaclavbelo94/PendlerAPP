
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Shift, AnalyticsPeriod } from "./types";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from "date-fns";
import { cs } from "date-fns/locale";

interface ShiftAnalyticsProps {
  shifts: Shift[];
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
}

const COLORS = {
  morning: '#10B981',
  afternoon: '#3B82F6', 
  night: '#8B5CF6'
};

const ShiftAnalytics: React.FC<ShiftAnalyticsProps> = ({ shifts, period, onPeriodChange }) => {
  // Filter shifts based on selected period
  const getFilteredShifts = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    return shifts.filter(shift => 
      isWithinInterval(shift.date, { start: startDate, end: endDate })
    );
  };

  const filteredShifts = getFilteredShifts();

  // Calculate shift distribution
  const shiftDistribution = [
    {
      name: 'Ranní',
      value: filteredShifts.filter(s => s.type === 'morning').length,
      color: COLORS.morning
    },
    {
      name: 'Odpolední',
      value: filteredShifts.filter(s => s.type === 'afternoon').length,
      color: COLORS.afternoon
    },
    {
      name: 'Noční',
      value: filteredShifts.filter(s => s.type === 'night').length,
      color: COLORS.night
    }
  ].filter(item => item.value > 0);

  // Calculate trend data
  const trendData = [
    { name: 'Ranní', hours: filteredShifts.filter(s => s.type === 'morning').length * 8 },
    { name: 'Odpolední', hours: filteredShifts.filter(s => s.type === 'afternoon').length * 8 },
    { name: 'Noční', hours: filteredShifts.filter(s => s.type === 'night').length * 8 }
  ];

  const totalHours = filteredShifts.length * 8;
  const totalShifts = filteredShifts.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Analýza směn</CardTitle>
              <CardDescription>
                Přehled vašich směn za vybrané období
              </CardDescription>
            </div>
            <Select value={period} onValueChange={(value: AnalyticsPeriod) => onPeriodChange(value)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Období" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Týden</SelectItem>
                <SelectItem value="month">Měsíc</SelectItem>
                <SelectItem value="year">Rok</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalShifts}</div>
              <div className="text-sm text-muted-foreground">Celkem směn</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalHours}</div>
              <div className="text-sm text-muted-foreground">Celkem hodin</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {filteredShifts.filter(s => s.type === 'morning').length}
              </div>
              <div className="text-sm text-muted-foreground">Ranní směny</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {filteredShifts.filter(s => s.type === 'night').length}
              </div>
              <div className="text-sm text-muted-foreground">Noční směny</div>
            </div>
          </div>

          {filteredShifts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribution Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Distribuce</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={shiftDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {shiftDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  {shiftDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trend Chart */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Trend</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Žádné směny pro vybrané období
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftAnalytics;
