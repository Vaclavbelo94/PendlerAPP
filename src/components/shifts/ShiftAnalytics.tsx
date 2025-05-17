import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartColumnBig } from "lucide-react";
import { Shift, AnalyticsPeriod } from "./types";

interface ShiftAnalyticsProps {
  shifts: Shift[];
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
}

// Colors for the different shift types
const COLORS = {
  morning: "#3b82f6",  // blue-500
  afternoon: "#22c55e", // green-500
  night: "#a855f7",    // purple-500
};

// Define a chart config for the ChartContainer
const chartConfig = {
  morning: { 
    color: COLORS.morning,
    label: "Ranní"
  },
  afternoon: { 
    color: COLORS.afternoon,
    label: "Odpolední"
  },
  night: { 
    color: COLORS.night,
    label: "Noční"
  }
};

const ShiftAnalytics = ({ shifts, period, onPeriodChange }: ShiftAnalyticsProps) => {
  const [selectedTab, setSelectedTab] = useState<"distribution" | "trend">("distribution");

  // Filter shifts based on the selected period
  const filteredShifts = useMemo(() => {
    const now = new Date();
    let startDate, endDate;
    
    switch(period) {
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }
    
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= startDate && shiftDate <= endDate;
    });
  }, [shifts, period]);
  
  // Prepare data for the pie chart (shift type distribution)
  const pieChartData = useMemo(() => {
    const typeCounts = filteredShifts.reduce((acc, shift) => {
      const { type } = shift;
      if (!acc[type]) acc[type] = 0;
      acc[type]++;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(typeCounts).map(([name, value]) => ({
      name: name === "morning" ? "Ranní" : name === "afternoon" ? "Odpolední" : "Noční",
      value,
      color: COLORS[name as keyof typeof COLORS]
    }));
  }, [filteredShifts]);
  
  // Prepare data for the bar chart (shift trend over time)
  const trendData = useMemo(() => {
    if (filteredShifts.length === 0) return [];

    const sortedShifts = [...filteredShifts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstDate = new Date(sortedShifts[0].date);
    const lastDate = new Date(sortedShifts[sortedShifts.length - 1].date);

    const daysInterval = eachDayOfInterval({ start: firstDate, end: lastDate });
    
    // Group shifts by date
    const shiftsByDate = daysInterval.map(date => {
      const dateString = format(date, "yyyy-MM-dd");
      const dayShifts = sortedShifts.filter(shift => 
        format(new Date(shift.date), "yyyy-MM-dd") === dateString
      );
      
      return {
        date: format(date, "dd.MM"),
        morning: dayShifts.filter(s => s.type === "morning").length,
        afternoon: dayShifts.filter(s => s.type === "afternoon").length,
        night: dayShifts.filter(s => s.type === "night").length,
      };
    });
    
    return shiftsByDate;
  }, [filteredShifts]);

  // Custom tooltip renderer for the pie chart
  const renderPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <div className="flex flex-col">
            <span className="text-sm font-bold">{payload[0].name}</span>
            <span className="text-xs">Počet: {payload[0].value}</span>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip renderer for the bar chart
  const renderBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <div className="flex flex-col">
            <span className="text-sm font-bold">{label}</span>
            {payload.map((entry: any) => (
              <span key={entry.name} className="text-xs flex items-center">
                <span 
                  className="w-2 h-2 rounded-full mr-1" 
                  style={{ backgroundColor: entry.color }}
                ></span>
                {entry.name === "morning" ? "Ranní" : entry.name === "afternoon" ? "Odpolední" : "Noční"}: {entry.value}
              </span>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h2 className="text-2xl font-bold">Analýza směn</h2>
        <div className="flex items-center space-x-2">
          <Label htmlFor="period">Období:</Label>
          <Select value={period} onValueChange={(value: AnalyticsPeriod) => onPeriodChange(value)}>
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
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "distribution" | "trend")} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="distribution" className="flex-1">Distribuce</TabsTrigger>
            <TabsTrigger value="trend" className="flex-1">Trend</TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="pt-4">
            {pieChartData.length > 0 ? (
              <ChartContainer className="h-[300px]" config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={renderPieTooltip} />
                    <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <ChartColumnBig className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-muted-foreground">Žádné směny v tomto období</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trend" className="pt-4">
            {trendData.length > 0 ? (
              <ChartContainer className="h-[300px]" config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip content={renderBarTooltip} />
                    <Legend formatter={(value) => (
                      <span className="text-sm">
                        {value === "morning" ? "Ranní" : value === "afternoon" ? "Odpolední" : "Noční"}
                      </span>
                    )} />
                    <Bar dataKey="morning" stackId="a" fill={COLORS.morning} />
                    <Bar dataKey="afternoon" stackId="a" fill={COLORS.afternoon} />
                    <Bar dataKey="night" stackId="a" fill={COLORS.night} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <ChartColumnBig className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-muted-foreground">Žádné směny v tomto období</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ShiftAnalytics;
