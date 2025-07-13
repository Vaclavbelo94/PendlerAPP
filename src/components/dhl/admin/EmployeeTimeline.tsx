import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  Clock, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Employee {
  id: string;
  email: string;
  username?: string;
}

interface Shift {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  type: string;
  notes?: string;
}

interface TimelineDay {
  date: string;
  shifts: Shift[];
  dayOfWeek: string;
}

const EmployeeTimeline: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [timelineData, setTimelineData] = useState<TimelineDay[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      loadEmployeeShifts();
    }
  }, [selectedEmployee, currentWeekStart]);

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, username')
        .eq('is_dhl_employee', true)
        .order('email');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Chyba při načítání zaměstnanců');
    }
  };

  const loadEmployeeShifts = async () => {
    if (!selectedEmployee) return;

    try {
      setLoading(true);
      
      // Calculate week range
      const weekStart = new Date(currentWeekStart);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const { data: shifts, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', selectedEmployee)
        .gte('date', weekStart.toISOString().split('T')[0])
        .lte('date', weekEnd.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      // Generate timeline for 7 days
      const timeline: TimelineDay[] = [];
      const currentDay = new Date(weekStart);
      
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDay.toISOString().split('T')[0];
        const dayShifts = (shifts || []).filter(shift => shift.date === dateStr);
        
        timeline.push({
          date: dateStr,
          shifts: dayShifts,
          dayOfWeek: currentDay.toLocaleDateString('cs-CZ', { weekday: 'short' })
        });
        
        currentDay.setDate(currentDay.getDate() + 1);
      }

      setTimelineData(timeline);
    } catch (error) {
      console.error('Error loading employee shifts:', error);
      toast.error('Chyba při načítání směn zaměstnance');
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    if (direction === 'prev') {
      newWeekStart.setDate(newWeekStart.getDate() - 7);
    } else {
      newWeekStart.setDate(newWeekStart.getDate() + 7);
    }
    setCurrentWeekStart(newWeekStart);
  };

  const getShiftTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ranni': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'odpoledni': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'nocni': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    // Position as percentage of 24 hours (0-100%)
    return (totalMinutes / (24 * 60)) * 100;
  };

  const getShiftDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    let duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
    
    // Handle overnight shifts
    if (duration < 0) {
      duration += 24 * 60; // Add 24 hours
    }
    
    return (duration / (24 * 60)) * 100; // percentage of day
  };

  const filteredEmployees = employees.filter(emp => 
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.username && emp.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-yellow-600" />
            Timeline zaměstnanců
          </CardTitle>
          <CardDescription>
            Zobrazení individuálních rozvrhů a směn zaměstnanců
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hledat zaměstnance..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Vyberte zaměstnance" />
              </SelectTrigger>
              <SelectContent>
                {filteredEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.username || employee.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedEmployee && (
        <>
          {/* Week Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Předchozí týden
                </Button>
                
                <div className="text-center">
                  <h3 className="font-semibold">
                    {currentWeekStart.toLocaleDateString('cs-CZ')} - {' '}
                    {new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('cs-CZ')}
                  </h3>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek('next')}
                >
                  Další týden
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Týdenní rozvrh</CardTitle>
              <CardDescription>
                Vizuální zobrazení směn pro vybraného zaměstnance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Time scale header */}
                  <div className="flex items-center">
                    <div className="w-16 text-sm font-medium">Den</div>
                    <div className="flex-1 relative h-6 border-b">
                      {[0, 6, 12, 18, 24].map((hour) => (
                        <div
                          key={hour}
                          className="absolute top-0 text-xs text-muted-foreground"
                          style={{ left: `${(hour / 24) * 100}%` }}
                        >
                          {hour}:00
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline rows */}
                  {timelineData.map((day) => {
                    const isToday = day.date === new Date().toISOString().split('T')[0];
                    
                    return (
                      <div key={day.date} className="flex items-center group">
                        <div className="w-16 text-sm">
                          <div className={`font-medium ${isToday ? 'text-yellow-600' : ''}`}>
                            {day.dayOfWeek}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(day.date).getDate()}
                          </div>
                        </div>
                        
                        <div className="flex-1 relative h-12 border rounded bg-muted/10">
                          {/* Hour markers */}
                          {[6, 12, 18].map((hour) => (
                            <div
                              key={hour}
                              className="absolute top-0 bottom-0 w-px bg-border opacity-30"
                              style={{ left: `${(hour / 24) * 100}%` }}
                            />
                          ))}
                          
                          {/* Shifts */}
                          {day.shifts.map((shift, index) => {
                            const left = getTimePosition(shift.start_time);
                            const width = getShiftDuration(shift.start_time, shift.end_time);
                            
                            return (
                              <div
                                key={shift.id}
                                className={`
                                  absolute top-1 bottom-1 rounded px-2 flex items-center justify-between
                                  text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity
                                  ${getShiftTypeColor(shift.type)}
                                `}
                                style={{
                                  left: `${left}%`,
                                  width: `${width}%`,
                                  minWidth: '60px'
                                }}
                                title={`${shift.type}: ${shift.start_time} - ${shift.end_time}${shift.notes ? `\n${shift.notes}` : ''}`}
                              >
                                <span className="truncate">{shift.type}</span>
                                <div className="flex items-center gap-1 ml-2">
                                  <Clock className="h-3 w-3" />
                                  <span className="whitespace-nowrap">
                                    {shift.start_time}-{shift.end_time}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          
                          {day.shifts.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                              Volno
                            </div>
                          )}
                          
                          {/* Today indicator */}
                          {isToday && (
                            <div className="absolute inset-0 border-2 border-yellow-500 rounded pointer-events-none" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Týdenní souhrn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {timelineData.reduce((total, day) => total + day.shifts.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Celkem směn</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {timelineData.reduce((total, day) => {
                      return total + day.shifts.reduce((dayTotal, shift) => {
                        const duration = getShiftDuration(shift.start_time, shift.end_time);
                        return dayTotal + (duration / 100) * 24; // Convert back to hours
                      }, 0);
                    }, 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Hodin celkem</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {timelineData.filter(day => day.shifts.length > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pracovních dnů</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {7 - timelineData.filter(day => day.shifts.length > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Volných dnů</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default EmployeeTimeline;