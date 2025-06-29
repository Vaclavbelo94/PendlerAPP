import React, { useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import { RefreshCw, Clock, AlertCircle, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';

interface MockShift {
  id: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  startTime: string;
  endTime: string;
  isAutoSync: boolean;
  lastUpdated: string;
  notes?: string;
}

interface DHLTimeCalendarMockupProps {
  shifts: MockShift[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  isDHLUser: boolean;
}

// Mock data pro demo
const mockShifts: MockShift[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'morning',
    startTime: '06:00',
    endTime: '14:30',
    isAutoSync: true,
    lastUpdated: '2024-01-15T05:30:00Z',
    notes: 'Automaticky aktualizováno z plánu haly'
  },
  {
    id: '2', 
    date: '2024-01-16',
    type: 'afternoon',
    startTime: '14:00',
    endTime: '22:30',
    isAutoSync: false,
    lastUpdated: '2024-01-16T12:00:00Z',
    notes: 'Manuálně upraveno uživatelem'
  },
  {
    id: '3',
    date: '2024-01-17',
    type: 'night',
    startTime: '22:00',
    endTime: '06:00',
    isAutoSync: true,
    lastUpdated: '2024-01-17T21:30:00Z'
  },
  {
    id: '4',
    date: '2024-01-18',
    type: 'morning',
    startTime: '06:30',
    endTime: '15:00',
    isAutoSync: true,
    lastUpdated: '2024-01-18T05:45:00Z'
  },
  {
    id: '5',
    date: '2024-01-19',
    type: 'afternoon',
    startTime: '13:30',
    endTime: '22:00',
    isAutoSync: false,
    lastUpdated: '2024-01-19T11:15:00Z',
    notes: 'Upraveno kvůli osobním důvodům'
  }
];

const DHLTimeCalendarMockup: React.FC<DHLTimeCalendarMockupProps> = ({
  shifts: propShifts,
  selectedDate,
  onSelectDate,
  isDHLUser
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use mock data for demo
  const shifts = mockShifts;

  const SHIFT_TYPE_COLORS = {
    morning: 'bg-blue-500 text-white',
    afternoon: 'bg-orange-500 text-white', 
    night: 'bg-purple-500 text-white'
  } as const;

  const SHIFT_TYPE_LABELS = {
    morning: 'Ranní',
    afternoon: 'Odpolední',
    night: 'Noční'
  } as const;

  // Calculate shift duration
  const calculateDuration = (startTime: string, endTime: string): string => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    
    // Handle overnight shifts
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Get shift for specific date
  const getShiftForDate = (date: Date): MockShift | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return shifts.find(shift => shift.date === dateStr);
  };

  // Calendar modifiers
  const modifiers = useMemo(() => {
    const datesWithShifts = shifts.map(shift => parseISO(shift.date));
    const autoSyncDates = shifts.filter(s => s.isAutoSync).map(shift => parseISO(shift.date));
    const manualDates = shifts.filter(s => !s.isAutoSync).map(shift => parseISO(shift.date));
    
    return {
      hasShift: datesWithShifts,
      autoSync: autoSyncDates, 
      manual: manualDates
    };
  }, [shifts]);

  const modifiersStyles = useMemo(() => ({
    hasShift: {
      fontWeight: 'bold'
    },
    autoSync: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'white'
    },
    manual: {
      backgroundColor: 'hsl(var(--secondary))',
      color: 'hsl(var(--secondary-foreground))',
      border: '2px solid hsl(var(--primary))'
    }
  }), []);

  const handleRefreshSync = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleResetToHallPlan = (shiftId: string) => {
    console.log('Reset to hall plan:', shiftId);
    // Implementation would reset manual overrides
  };

  const selectedShift = selectedDate ? getShiftForDate(selectedDate) : null;

  // Calculate stats
  const stats = useMemo(() => {
    const totalShifts = shifts.length;
    const autoSyncCount = shifts.filter(s => s.isAutoSync).length;
    const manualCount = shifts.filter(s => !s.isAutoSync).length;
    
    return { totalShifts, autoSyncCount, manualCount };
  }, [shifts]);

  return (
    <div className="space-y-6">
      {/* Header s akcemi */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              DHL Kalendář směn s časy
            </CardTitle>
            
            {isDHLUser && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefreshSync}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Aktualizuji...' : 'Sync nyní'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Main Calendar */}
      <Card>
        <CardContent className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            locale={cs}
            className="w-full"
          />
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>Auto-sync směna</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary border-2 border-primary rounded"></div>
              <span>Manuálně upraveno</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Detail */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, 'EEEE, d. MMMM yyyy', { locale: cs })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedShift ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={SHIFT_TYPE_COLORS[selectedShift.type]}>
                      {SHIFT_TYPE_LABELS[selectedShift.type]}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {selectedShift.startTime} - {selectedShift.endTime}
                      <span className="ml-2 font-medium">
                        ({calculateDuration(selectedShift.startTime, selectedShift.endTime)})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedShift.isAutoSync ? (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Auto-sync
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Manuálně
                      </Badge>
                    )}
                  </div>
                </div>
                
                {selectedShift.notes && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{selectedShift.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    Poslední aktualizace: {format(parseISO(selectedShift.lastUpdated), 'dd.MM.yyyy HH:mm', { locale: cs })}
                  </span>
                  
                  {!selectedShift.isAutoSync && isDHLUser && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleResetToHallPlan(selectedShift.id)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reset na plán haly
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Žádná směna naplánována
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.totalShifts}</div>
            <div className="text-sm text-muted-foreground">Celkem směn</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.autoSyncCount}</div>
            <div className="text-sm text-muted-foreground">Auto-sync</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.manualCount}</div>
            <div className="text-sm text-muted-foreground">Manuálně upraveno</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DHLTimeCalendarMockup;
