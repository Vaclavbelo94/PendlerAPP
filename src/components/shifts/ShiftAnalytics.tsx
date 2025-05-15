
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartColumnBig } from "lucide-react";

// Shift types
type ShiftType = "morning" | "afternoon" | "night";

// Shift interface
interface Shift {
  date: Date;
  type: ShiftType;
  userId: string;
  notes?: string;
}

interface ShiftAnalyticsProps {
  shifts: Shift[];
  period: "week" | "month" | "year";
  onPeriodChange: (period: "week" | "month" | "year") => void;
}

// Colors for the different shift types
const SHIFT_COLORS = {
  morning: "#3b82f6",  // blue
  afternoon: "#22c55e", // green
  night: "#8b5cf6"      // purple
};

const ShiftAnalytics: React.FC<ShiftAnalyticsProps> = ({ 
  shifts, 
  period,
  onPeriodChange
}) => {
  // Group shifts by type to get totals
  const shiftsByType = useMemo(() => {
    const grouped = {
      morning: shifts.filter(s => s.type === "morning").length,
      afternoon: shifts.filter(s => s.type === "afternoon").length,
      night: shifts.filter(s => s.type === "night").length
    };
    
    return [
      { name: "Ranní", value: grouped.morning, color: SHIFT_COLORS.morning },
      { name: "Odpolední", value: grouped.afternoon, color: SHIFT_COLORS.afternoon },
      { name: "Noční", value: grouped.night, color: SHIFT_COLORS.night }
    ];
  }, [shifts]);
  
  // Calculate total working hours 
  const totalHours = useMemo(() => shifts.length * 8, [shifts]);
  
  // Group shifts by day of week
  const shiftsByDayOfWeek = useMemo(() => {
    const days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    const grouped = days.map(day => ({
      name: day,
      morning: 0,
      afternoon: 0,
      night: 0
    }));
    
    shifts.forEach(shift => {
      const dayOfWeek = new Date(shift.date).getDay();
      grouped[dayOfWeek][shift.type]++;
    });
    
    return grouped;
  }, [shifts]);

  // Group shifts by month
  const shiftsByMonth = useMemo(() => {
    const months = [
      "Leden", "Únor", "Březen", "Duben", "Květen", "Červen", 
      "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
    ];
    
    const grouped = months.map(month => ({
      name: month,
      morning: 0,
      afternoon: 0,
      night: 0
    }));
    
    shifts.forEach(shift => {
      const monthIndex = new Date(shift.date).getMonth();
      grouped[monthIndex][shift.type]++;
    });
    
    return grouped;
  }, [shifts]);

  // Function to get the appropriate chart data based on selected period
  const getChartData = () => {
    switch (period) {
      case "week":
        return shiftsByDayOfWeek;
      case "month":
        // For month view, we'll use a subset of the month data
        const currentMonth = new Date().getMonth();
        const startDay = new Date().getDate() - 30; // Last 30 days
        const filteredShifts = shifts.filter(shift => {
          const shiftDate = new Date(shift.date);
          const dayDiff = Math.floor((new Date().getTime() - shiftDate.getTime()) / (1000 * 60 * 60 * 24));
          return dayDiff <= 30;
        });
        
        // Group by day
        const dayData: any[] = [];
        const daysMap = new Map();
        
        filteredShifts.forEach(shift => {
          const day = new Date(shift.date).getDate();
          const key = `${day}`;
          
          if (!daysMap.has(key)) {
            daysMap.set(key, {
              name: `${day}`,
              morning: 0,
              afternoon: 0,
              night: 0
            });
          }
          
          daysMap.get(key)[shift.type]++;
        });
        
        daysMap.forEach(value => dayData.push(value));
        return dayData.sort((a, b) => parseInt(a.name) - parseInt(b.name));
      
      case "year":
        return shiftsByMonth;
      default:
        return [];
    }
  };

  // Calculate consecutive working days
  const consecutiveWorkingDays = useMemo(() => {
    if (shifts.length === 0) return 0;
    
    // Sort shifts by date
    const sortedShifts = [...shifts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let maxConsecutive = 0;
    let currentStreak = 0;
    let previousDate: Date | null = null;
    
    sortedShifts.forEach(shift => {
      const currentDate = new Date(shift.date);
      
      if (previousDate) {
        // Check if this shift is exactly 1 day after the previous one
        const dayDiff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          // Reset streak if there's a gap
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      maxConsecutive = Math.max(maxConsecutive, currentStreak);
      previousDate = currentDate;
    });
    
    return maxConsecutive;
  }, [shifts]);

  // Calculate weekend shifts
  const weekendShifts = useMemo(() => 
    shifts.filter(shift => {
      const day = new Date(shift.date).getDay();
      return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
    }).length,
    [shifts]
  );

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analýza směn</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="period">Období:</Label>
          <Select value={period} onValueChange={(value: "week" | "month" | "year") => onPeriodChange(value)}>
            <SelectTrigger id="period" className="w-[180px]">
              <SelectValue placeholder="Vyberte období" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Týden</SelectItem>
              <SelectItem value="month">Měsíc</SelectItem>
              <SelectItem value="year">Rok</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Main analytics area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary stats */}
        <Card>
          <CardHeader>
            <CardTitle>Souhrn</CardTitle>
            <CardDescription>Základní statistiky směn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Celkem směn:</span>
                <span className="font-bold text-lg">{shifts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Celkem hodin:</span>
                <span className="font-bold text-lg">{totalHours}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Víkendových směn:</span>
                <span className="font-bold text-lg">{weekendShifts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Max. po sobě jdoucích dní:</span>
                <span className="font-bold text-lg">{consecutiveWorkingDays}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      
        {/* Shift distribution by type */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Rozložení typů směn</CardTitle>
            <CardDescription>Poměr ranních, odpoledních a nočních směn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shiftsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {shiftsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span>Ranní: {shiftsByType[0].value} směn ({totalHours > 0 ? ((shiftsByType[0].value * 100) / shifts.length).toFixed(0) : 0}%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span>Odpolední: {shiftsByType[1].value} směn ({totalHours > 0 ? ((shiftsByType[1].value * 100) / shifts.length).toFixed(0) : 0}%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  <span>Noční: {shiftsByType[2].value} směn ({totalHours > 0 ? ((shiftsByType[2].value * 100) / shifts.length).toFixed(0) : 0}%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Shift distribution chart */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Rozložení směn v čase</CardTitle>
          <CardDescription>
            {period === "week" ? "Rozložení podle dnů v týdnu" : 
             period === "month" ? "Rozložení za poslední měsíc" : 
             "Rozložení podle měsíců v roce"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px]">
            <ChartContainer
              config={{
                morning: { color: SHIFT_COLORS.morning },
                afternoon: { color: SHIFT_COLORS.afternoon },
                night: { color: SHIFT_COLORS.night },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Bar dataKey="morning" name="Ranní" fill={SHIFT_COLORS.morning} />
                  <Bar dataKey="afternoon" name="Odpolední" fill={SHIFT_COLORS.afternoon} />
                  <Bar dataKey="night" name="Noční" fill={SHIFT_COLORS.night} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftAnalytics;
