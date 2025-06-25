
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Calendar as CalendarIcon, Edit, RotateCcw, Clock, AlertTriangle } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { DHLShift } from '@/types/dhl';
import { cn } from '@/lib/utils';

interface DHLShiftCalendarProps {
  dhlShifts: DHLShift[];
  onOverrideShift: (shiftId: string, overrideData: Partial<DHLShift>) => void;
  onRestoreShift: (shiftId: string) => void;
  onGenerateShifts: (startDate: string, endDate: string) => void;
  isLoading?: boolean;
}

const DHLShiftCalendar: React.FC<DHLShiftCalendarProps> = ({
  dhlShifts,
  onOverrideShift,
  onRestoreShift,
  onGenerateShifts,
  isLoading = false
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<DHLShift | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editType, setEditType] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [editNotes, setEditNotes] = useState('');

  // Group shifts by date
  const shiftsMap = useMemo(() => {
    const map = new Map<string, DHLShift[]>();
    dhlShifts.forEach(shift => {
      const dateKey = format(new Date(shift.date), 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(shift);
    });
    return map;
  }, [dhlShifts]);

  const selectedDateShifts = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return shiftsMap.get(dateKey) || [];
  }, [selectedDate, shiftsMap]);

  const modifiers = useMemo(() => ({
    hasDHLShift: (date: Date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      return shiftsMap.has(dateKey);
    },
    hasOverride: (date: Date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const shifts = shiftsMap.get(dateKey) || [];
      return shifts.some(shift => shift.dhl_override);
    }
  }), [shiftsMap]);

  const modifiersClassNames = {
    hasDHLShift: 'bg-yellow-100 text-yellow-800 font-bold',
    hasOverride: 'bg-orange-100 text-orange-800 font-bold border-2 border-orange-300'
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return 'Ranní';
      case 'afternoon': return 'Odpolední';
      case 'night': return 'Noční';
      default: return type;
    }
  };

  const getShiftTypeColor = (type: string, isOverride: boolean) => {
    const baseColors = {
      morning: 'bg-blue-100 text-blue-800',
      afternoon: 'bg-green-100 text-green-800',
      night: 'bg-purple-100 text-purple-800'
    };
    
    const overrideColors = {
      morning: 'bg-orange-100 text-orange-800 border border-orange-300',
      afternoon: 'bg-red-100 text-red-800 border border-red-300',
      night: 'bg-pink-100 text-pink-800 border border-pink-300'
    };

    return isOverride ? overrideColors[type as keyof typeof overrideColors] : baseColors[type as keyof typeof baseColors];
  };

  const handleEditShift = (shift: DHLShift) => {
    setSelectedShift(shift);
    setEditType(shift.type);
    setEditNotes(shift.notes || '');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedShift) return;

    onOverrideShift(selectedShift.id!, {
      type: editType,
      notes: editNotes
    });

    setEditDialogOpen(false);
    setSelectedShift(null);
  };

  const handleGenerateShifts = () => {
    if (startDate && endDate) {
      onGenerateShifts(startDate, endDate);
      setGenerateDialogOpen(false);
      setStartDate('');
      setEndDate('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-yellow-600" />
              <CardTitle>DHL Kalendář směn</CardTitle>
            </div>
            <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Vygenerovat směny
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Vygenerovat DHL směny</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="start-date">Od datum</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">Do datum</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Směny budou vygenerovány podle vašich DHL šablon pro vybrané období.
                      Existující směny nebudou přepsány.
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
                      Zrušit
                    </Button>
                    <Button onClick={handleGenerateShifts} disabled={!startDate || !endDate || isLoading}>
                      Vygenerovat
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border rounded"></div>
              <span>DHL směna</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
              <span>Upravená směna</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={cs}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Selected date shifts */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(selectedDate, 'dd. MMMM yyyy', { locale: cs })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateShifts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Na tento den nejsou naplánovány žádné DHL směny</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateShifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={cn("text-xs", getShiftTypeColor(shift.type, shift.dhl_override || false))}>
                        {getShiftTypeLabel(shift.type)}
                      </Badge>
                      {shift.dhl_override && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs">Upraveno</span>
                        </div>
                      )}
                      {shift.original_dhl_data && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">
                            {shift.original_dhl_data.start_time} - {shift.original_dhl_data.end_time}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditShift(shift)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {shift.dhl_override && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRestoreShift(shift.id!)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit shift dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upravit DHL směnu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Typ směny</Label>
              <Select value={editType} onValueChange={(value: 'morning' | 'afternoon' | 'night') => setEditType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Ranní směna</SelectItem>
                  <SelectItem value="afternoon">Odpolední směna</SelectItem>
                  <SelectItem value="night">Noční směna</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-notes">Poznámky</Label>
              <Textarea
                id="edit-notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Zadejte poznámky k směně..."
                rows={3}
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Tato úprava označí směnu jako "override" a nebude již automaticky aktualizována systémem DHL.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Zrušit
              </Button>
              <Button onClick={handleSaveEdit}>
                Uložit změny
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DHLShiftCalendar;
