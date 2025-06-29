
import React, { useMemo, useCallback, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { cs, de, pl } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Sync, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Extended shift type with time information
interface DHLShiftWithTime {
  id: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  start_time: string; // "06:00"
  end_time: string;   // "14:00"
  notes?: string;
  auto_updated_at?: string;
  is_manual_override?: boolean;
}

interface DHLTimeCalendarMockupProps {
  shifts: DHLShiftWithTime[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  currentShift?: DHLShiftWithTime;
  onOpenNoteDialog?: () => void;
  isDHLUser?: boolean;
}

// Mock data for demonstration
const mockDHLShifts: DHLShiftWithTime[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'morning',
    start_time: '06:00',
    end_time: '14:00',
    notes: 'Standardní ranní směna',
    auto_updated_at: '2024-01-14T22:00:00Z'
  },
  {
    id: '2',
    date: '2024-01-16',
    type: 'afternoon',
    start_time: '14:00',
    end_time: '22:00',
    notes: 'Odpolední směna - vysoký provoz',
    auto_updated_at: '2024-01-15T14:00:00Z'
  },
  {
    id: '3',
    date: '2024-01-17',
    type: 'night',
    start_time: '22:00',
    end_time: '06:00',
    notes: 'Noční směna',
    is_manual_override: true
  },
  {
    id: '4',
    date: '2024-01-18',
    type: 'morning',
    start_time: '05:30',
    end_time: '13:30',
    notes: 'Upravený čas kvůli vysokému objemu',
    auto_updated_at: '2024-01-17T22:00:00Z'
  }
];

const DHLTimeCalendarMockup: React.FC<DHLTimeCalendarMockupProps> = ({
  shifts = mockDHLShifts,
  selectedDate,
  onSelectDate,
  currentShift,
  onOpenNoteDialog,
  isDHLUser = true
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const { t, i18n } = useTranslation('shifts');

  // Get appropriate date-fns locale
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'de': return de;
      case 'pl': return pl;
      case 'cs':
      default: return cs;
    }
  };

  const SHIFT_TYPE_COLORS = {
    morning: 'bg-blue-100 text-blue-800 border-blue-200',
    afternoon: 'bg-orange-100 text-orange-800 border-orange-200',
    night: 'bg-purple-100 text-purple-800 border-purple-200'
  } as const;

  const getShiftTypeLabel = (type: 'morning' | 'afternoon' | 'night') => {
    switch (type) {
      case 'morning': return 'Ranní';
      case 'afternoon': return 'Odpolední';
      case 'night': return 'Noční';
      default: return type;
    }
  };

  // Memoized shift lookup for better performance
  const shiftsByDate = useMemo(() => {
    const lookup = new Map<string, DHLShiftWithTime>();
    
    shifts.forEach(shift => {
      const dateKey = format(new Date(shift.date), 'yyyy-MM-dd');
      lookup.set(dateKey, shift);
    });
    
    return lookup;
  }, [shifts]);

  // Optimized shift lookup function
  const getShiftForDate = useCallback((date: Date): DHLShiftWithTime | undefined => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return shiftsByDate.get(dateKey);
  }, [shiftsByDate]);

  // Memoized modifiers for calendar styling
  const modifiers = useMemo(() => {
    const datesWithShifts = shifts.map(shift => new Date(shift.date));
    const autoUpdatedDates = shifts
      .filter(shift => shift.auto_updated_at)
      .map(shift => new Date(shift.date));
    const overriddenDates = shifts
      .filter(shift => shift.is_manual_override)
      .map(shift => new Date(shift.date));
    
    return {
      hasShift: datesWithShifts,
      autoUpdated: autoUpdatedDates,
      manualOverride: overriddenDates
    };
  }, [shifts]);

  const modifiersStyles = useMemo(() => ({
    hasShift: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'white',
      fontWeight: 'bold'
    },
    autoUpdated: {
      backgroundColor: '#10b981',
      color: 'white',
      fontWeight: 'bold',
      border: '2px solid #059669'
    },
    manualOverride: {
      backgroundColor: '#f59e0b',
      color: 'white',
      fontWeight: 'bold',
      border: '2px solid #d97706'
    }
  }), []);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  }, []);

  const handleTodayClick = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    if (onSelectDate) onSelectDate(today);
  }, [onSelectDate]);

  const formatShiftTime = (shift: DHLShiftWithTime) => {
    return `${shift.start_time} - ${shift.end_time}`;
  };

  const getShiftDuration = (shift: DHLShiftWithTime) => {
    const [startHour, startMin] = shift.start_time.split(':').map(Number);
    const [endHour, endMin] = shift.end_time.split(':').map(Number);
    
    let duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    if (duration < 0) duration += 24 * 60; // Handle night shifts crossing midnight
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            DHL Směny s přesnými časy
            {isDHLUser && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                DHL Zaměstnanec
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Sync className="h-3 w-3" />
              Auto-sync: 3x denně
            </Button>
            
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleTodayClick}
              className="px-3 py-1 text-sm hover:bg-muted rounded-md transition-colors"
            >
              Dnes
            </button>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="text-lg font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: getDateLocale() })}
        </div>
      </CardHeader>
      
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          locale={getDateLocale()}
          className="w-full"
        />
        
        {/* Enhanced Legend */}
        <div className="mt-4 space-y-3">
          <div className="text-sm text-muted-foreground">Legenda:</div>
          
          <div className="flex flex-wrap gap-2">
            {Object.entries(SHIFT_TYPE_COLORS).map(([type, colorClass]) => (
              <Badge 
                key={type}
                variant="secondary" 
                className={`text-xs ${colorClass}`}
              >
                {getShiftTypeLabel(type as any)}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
              <Sync className="h-3 w-3 mr-1" />
              Auto-aktualizováno
            </Badge>
            <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-200">
              Manuálně upraveno
            </Badge>
          </div>
        </div>
        
        {/* Enhanced Selected date info */}
        {selectedDate && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="font-medium mb-2">
              {format(selectedDate, 'EEEE, dd. MMMM yyyy', { locale: getDateLocale() })}
            </div>
            
            {(() => {
              const shift = getShiftForDate(selectedDate);
              if (shift) {
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={SHIFT_TYPE_COLORS[shift.type]}>
                          {getShiftTypeLabel(shift.type)}
                        </Badge>
                        
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Clock className="h-3 w-3" />
                          {formatShiftTime(shift)}
                        </div>
                        
                        <Badge variant="outline" className="text-xs">
                          {getShiftDuration(shift)}
                        </Badge>
                      </div>
                      
                      {shift.is_manual_override && (
                        <Badge className="text-xs bg-amber-100 text-amber-800">
                          Manuálně upraveno
                        </Badge>
                      )}
                      
                      {shift.auto_updated_at && (
                        <Badge className="text-xs bg-green-100 text-green-800">
                          <Bell className="h-3 w-3 mr-1" />
                          Auto-sync: {format(new Date(shift.auto_updated_at), 'HH:mm')}
                        </Badge>
                      )}
                    </div>
                    
                    {shift.notes && (
                      <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                        {shift.notes}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Upravit čas
                      </Button>
                      {shift.auto_updated_at && (
                        <Button size="sm" variant="outline">
                          Reset na plán haly
                        </Button>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="text-sm text-muted-foreground">
                    Žádná směna pro tento den
                  </div>
                );
              }
            })()}
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-700">
              {shifts.filter(s => s.type === 'morning').length}
            </div>
            <div className="text-xs text-blue-600">Ranní směny</div>
          </div>
          
          <div className="text-center p-2 bg-orange-50 rounded">
            <div className="text-lg font-bold text-orange-700">
              {shifts.filter(s => s.type === 'afternoon').length}
            </div>
            <div className="text-xs text-orange-600">Odpolední</div>
          </div>
          
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="text-lg font-bold text-purple-700">
              {shifts.filter(s => s.type === 'night').length}
            </div>
            <div className="text-xs text-purple-600">Noční směny</div>
          </div>
          
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-700">
              {shifts.filter(s => s.auto_updated_at).length}
            </div>
            <div className="text-xs text-green-600">Auto-sync</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DHLTimeCalendarMockup;
