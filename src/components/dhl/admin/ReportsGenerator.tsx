import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  FileText,
  Download,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  Clock,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportData {
  weeklyStats: Array<{
    week: string;
    totalShifts: number;
    totalHours: number;
    employees: number;
  }>;
  shiftTypeDistribution: Array<{
    type: string;
    count: number;
    color: string;
  }>;
  employeeWorkload: Array<{
    employee: string;
    hours: number;
    shifts: number;
  }>;
  dailyTrends: Array<{
    date: string;
    shifts: number;
    hours: number;
  }>;
}

const COLORS = ['#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

const ReportsGenerator: React.FC = () => {
  const [reportType, setReportType] = useState<'overview' | 'shifts' | 'employees' | 'trends'>('overview');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    generateReport();
  }, [reportType, dateRange]);

  const generateReport = async () => {
    try {
      setLoading(true);
      
      const fromDate = dateRange.from.toISOString().split('T')[0];
      const toDate = dateRange.to.toISOString().split('T')[0];

      // Get shifts data with employee info
      const { data: shifts, error } = await supabase
        .from('shifts')
        .select(`
          *,
          profiles!inner(email, username)
        `)
        .gte('date', fromDate)
        .lte('date', toDate)
        .eq('profiles.is_dhl_employee', true);

      if (error) throw error;

      // Process data for different report types
      const processedData = processReportData(shifts || []);
      setReportData(processedData);

    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Chyba při generování reportu');
    } finally {
      setLoading(false);
    }
  };

  const processReportData = (shifts: any[]): ReportData => {
    // Weekly stats
    const weeklyMap = new Map();
    shifts.forEach(shift => {
      const date = new Date(shift.date);
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      
      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, {
          week: weekKey,
          totalShifts: 0,
          totalHours: 0,
          employees: new Set()
        });
      }
      
      const weekData = weeklyMap.get(weekKey);
      weekData.totalShifts++;
      weekData.totalHours += calculateShiftHours(shift.start_time, shift.end_time);
      weekData.employees.add(shift.user_id);
    });

    const weeklyStats = Array.from(weeklyMap.values()).map(week => ({
      ...week,
      employees: week.employees.size
    }));

    // Shift type distribution
    const shiftTypeMap = new Map();
    shifts.forEach(shift => {
      const type = shift.type || 'Ostatní';
      shiftTypeMap.set(type, (shiftTypeMap.get(type) || 0) + 1);
    });

    const shiftTypeDistribution = Array.from(shiftTypeMap.entries()).map(([type, count], index) => ({
      type,
      count,
      color: COLORS[index % COLORS.length]
    }));

    // Employee workload
    const employeeMap = new Map();
    shifts.forEach(shift => {
      const employeeKey = shift.profiles?.username || shift.profiles?.email || 'Neznámý';
      
      if (!employeeMap.has(employeeKey)) {
        employeeMap.set(employeeKey, {
          employee: employeeKey,
          hours: 0,
          shifts: 0
        });
      }
      
      const empData = employeeMap.get(employeeKey);
      empData.shifts++;
      empData.hours += calculateShiftHours(shift.start_time, shift.end_time);
    });

    const employeeWorkload = Array.from(employeeMap.values())
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10);

    // Daily trends
    const dailyMap = new Map();
    shifts.forEach(shift => {
      const date = shift.date;
      
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          shifts: 0,
          hours: 0
        });
      }
      
      const dayData = dailyMap.get(date);
      dayData.shifts++;
      dayData.hours += calculateShiftHours(shift.start_time, shift.end_time);
    });

    const dailyTrends = Array.from(dailyMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      weeklyStats,
      shiftTypeDistribution,
      employeeWorkload,
      dailyTrends
    };
  };

  const calculateShiftHours = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
    
    if (duration < 0) {
      duration += 24; // Handle overnight shifts
    }
    
    return duration;
  };

  const exportToCSV = () => {
    if (!reportData) return;

    let csvContent = '';
    
    switch (reportType) {
      case 'overview':
        csvContent = 'Týden,Směny,Hodiny,Zaměstnanci\n';
        reportData.weeklyStats.forEach(week => {
          csvContent += `${week.week},${week.totalShifts},${week.totalHours.toFixed(1)},${week.employees}\n`;
        });
        break;
      case 'shifts':
        csvContent = 'Typ směny,Počet\n';
        reportData.shiftTypeDistribution.forEach(item => {
          csvContent += `${item.type},${item.count}\n`;
        });
        break;
      case 'employees':
        csvContent = 'Zaměstnanec,Hodiny,Směny\n';
        reportData.employeeWorkload.forEach(emp => {
          csvContent += `${emp.employee},${emp.hours.toFixed(1)},${emp.shifts}\n`;
        });
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dhl-report-${reportType}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report exportován do CSV');
  };

  const renderChart = () => {
    if (!reportData || loading) {
      return (
        <div className="flex items-center justify-center h-64">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          ) : (
            <p className="text-muted-foreground">Žádná data k zobrazení</p>
          )}
        </div>
      );
    }

    switch (reportType) {
      case 'overview':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalShifts" fill="#f59e0b" name="Směny" />
              <Bar dataKey="totalHours" fill="#10b981" name="Hodiny" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'shifts':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.shiftTypeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="count"
              >
                {reportData.shiftTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'employees':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.employeeWorkload} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="employee" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="hours" fill="#8b5cf6" name="Hodiny" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'trends':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="shifts" stroke="#f59e0b" name="Směny" />
              <Line type="monotone" dataKey="hours" stroke="#10b981" name="Hodiny" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-yellow-600" />
            Generátor reportů
          </CardTitle>
          <CardDescription>
            Vytváření a export detailních reportů o DHL operacích
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Report Type Selection */}
            <div className="space-y-2">
              <Label>Typ reportu</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Přehled
                    </div>
                  </SelectItem>
                  <SelectItem value="shifts">
                    <div className="flex items-center gap-2">
                      <PieChartIcon className="h-4 w-4" />
                      Analýza směn
                    </div>
                  </SelectItem>
                  <SelectItem value="employees">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Vytížení zaměstnanců
                    </div>
                  </SelectItem>
                  <SelectItem value="trends">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Trendy
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="flex gap-2">
              <div className="space-y-2">
                <Label>Od</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP") : "Vyberte datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Do</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP") : "Vyberte datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <Button 
                onClick={generateReport}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                Aktualizovat
              </Button>
              <Button 
                variant="outline"
                onClick={exportToCSV}
                disabled={!reportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === 'overview' && 'Týdenní přehled'}
            {reportType === 'shifts' && 'Distribuce typů směn'}
            {reportType === 'employees' && 'Vytížení zaměstnanců'}
            {reportType === 'trends' && 'Denní trendy'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {reportData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Celkem směn</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {reportData.weeklyStats.reduce((sum, week) => sum + week.totalShifts, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Celkem hodin</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reportData.weeklyStats.reduce((sum, week) => sum + week.totalHours, 0).toFixed(0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Aktivní zaměstnanci</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {reportData.employeeWorkload.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Průměr směn/den</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {reportData.dailyTrends.length > 0 
                      ? (reportData.dailyTrends.reduce((sum, day) => sum + day.shifts, 0) / reportData.dailyTrends.length).toFixed(1)
                      : '0'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportsGenerator;