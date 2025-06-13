
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface Shift {
  id: string;
  date: Date | string;
  type: 'morning' | 'afternoon' | 'night';
  location?: string;
  notes?: string;
}

interface ShiftsCalendarProps {
  shifts?: Shift[];
  onEditShift?: (shift: Shift) => void;
  onDeleteShift?: (shiftId: string) => void;
}

const ShiftsCalendar: React.FC<ShiftsCalendarProps> = ({ 
  shifts = [],
  onEditShift,
  onDeleteShift 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Convert string dates to Date objects and add default location
  const processedShifts: Shift[] = shifts.map(shift => ({
    ...shift,
    date: typeof shift.date === 'string' ? new Date(shift.date) : shift.date,
    location: shift.location || 'München, DE'
  }));

  // Add mock data if no shifts provided
  const allShifts: Shift[] = processedShifts.length > 0 ? processedShifts : [
    {
      id: '1',
      date: new Date(),
      type: 'morning',
      location: 'München, DE',
      notes: 'Standardní ranní směna'
    },
    {
      id: '2',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      type: 'afternoon',
      location: 'Augsburg, DE',
      notes: 'Odpolední směna'
    }
  ];

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return 'Ranní';
      case 'afternoon': return 'Odpolední';
      case 'night': return 'Noční';
      default: return type;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'afternoon': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'night': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const selectedDateShifts = allShifts.filter(shift => 
    selectedDate && format(shift.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Kalendář směn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={cs}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Date Details */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'dd. MMMM yyyy', { locale: cs }) : 'Vyberte datum'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateShifts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Pro tento den nejsou naplánované žádné směny</p>
                <Button className="mt-4" variant="outline">
                  Přidat směnu
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateShifts.map((shift) => (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getShiftTypeColor(shift.type)}>
                            {getShiftTypeLabel(shift.type)}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {shift.type === 'morning' ? '06:00 - 14:00' : 
                             shift.type === 'afternoon' ? '14:00 - 22:00' : '22:00 - 06:00'}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {shift.location}
                        </div>
                        {shift.notes && (
                          <p className="text-sm text-muted-foreground">{shift.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEditShift?.(shift)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-destructive/10"
                          onClick={() => onDeleteShift?.(shift.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ShiftsCalendar;
