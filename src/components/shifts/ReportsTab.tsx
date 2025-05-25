
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { cs } from "date-fns/locale";
import { Shift } from './types';

interface ReportsTabProps {
  shifts: Shift[];
  user: any;
}

type ReportPeriod = 'month' | 'quarter' | 'year' | 'custom';

export const ReportsTab: React.FC<ReportsTabProps> = ({ shifts, user }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('month');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [isGenerating, setIsGenerating] = useState(false);

  const getDateRange = () => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'month':
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      case 'quarter':
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const quarterStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
        const quarterEnd = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
        return {
          start: quarterStart,
          end: quarterEnd
        };
      case 'year':
        return {
          start: startOfYear(now),
          end: endOfYear(now)
        };
      case 'custom':
        return {
          start: customStartDate || startOfMonth(now),
          end: customEndDate || endOfMonth(now)
        };
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
    }
  };

  const filteredShifts = useMemo(() => {
    const { start, end } = getDateRange();
    
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate >= start && shiftDate <= end;
    });
  }, [shifts, selectedPeriod, customStartDate, customEndDate]);

  const reportStats = useMemo(() => {
    const totalShifts = filteredShifts.length;
    const morningShifts = filteredShifts.filter(s => s.type === 'morning').length;
    const afternoonShifts = filteredShifts.filter(s => s.type === 'afternoon').length;
    const nightShifts = filteredShifts.filter(s => s.type === 'night').length;
    const totalHours = totalShifts * 8; // Assuming 8 hours per shift
    
    return {
      totalShifts,
      morningShifts,
      afternoonShifts,
      nightShifts,
      totalHours
    };
  }, [filteredShifts]);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here would be actual report generation logic
      console.log('Generating report for period:', selectedPeriod);
      console.log('Report stats:', reportStats);
      
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const { start, end } = getDateRange();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generování reportů
          </CardTitle>
          <CardDescription>
            Vytvořte detailní reporty o vašich směnách
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Period Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="period-select">Období reportu</Label>
              <Select 
                value={selectedPeriod} 
                onValueChange={(value: ReportPeriod) => setSelectedPeriod(value)}
              >
                <SelectTrigger id="period-select" className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Vyberte období" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Tento měsíc</SelectItem>
                  <SelectItem value="quarter">Toto čtvrtletí</SelectItem>
                  <SelectItem value="year">Tento rok</SelectItem>
                  <SelectItem value="custom">Vlastní období</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {selectedPeriod === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Od</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        aria-label="Vybrat počáteční datum"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customStartDate ? format(customStartDate, "dd.MM.yyyy", { locale: cs }) : "Vyberte datum"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={setCustomStartDate}
                        locale={cs}
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
                        className="w-full justify-start text-left font-normal"
                        aria-label="Vybrat koncové datum"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customEndDate ? format(customEndDate, "dd.MM.yyyy", { locale: cs }) : "Vyberte datum"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={setCustomEndDate}
                        locale={cs}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {/* Period Display */}
            <div className="text-sm text-muted-foreground">
              Report za období: {format(start, "dd.MM.yyyy", { locale: cs })} - {format(end, "dd.MM.yyyy", { locale: cs })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Náhled reportu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{reportStats.totalShifts}</div>
              <div className="text-sm text-muted-foreground">Celkem směn</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{reportStats.totalHours}</div>
              <div className="text-sm text-muted-foreground">Celkem hodin</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{reportStats.morningShifts}</div>
              <div className="text-sm text-muted-foreground">Ranní směny</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{reportStats.nightShifts}</div>
              <div className="text-sm text-muted-foreground">Noční směny</div>
            </div>
          </div>

          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating || filteredShifts.length === 0}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? 'Generuji report...' : 'Stáhnout report (PDF)'}
          </Button>
          
          {filteredShifts.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Pro vybrané období nejsou k dispozici žádná data.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
