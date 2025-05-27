
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Shift } from '@/hooks/useShiftsManagement';

interface ShiftFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  shift?: Shift | null;
}

const ShiftForm: React.FC<ShiftFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  shift
}) => {
  const [date, setDate] = useState<Date | undefined>(
    shift ? new Date(shift.date) : new Date()
  );
  const [type, setType] = useState<'morning' | 'afternoon' | 'night'>(shift?.type || 'morning');
  const [notes, setNotes] = useState(shift?.notes || '');

  useEffect(() => {
    if (shift) {
      setDate(new Date(shift.date));
      setType(shift.type);
      setNotes(shift.notes || '');
    }
  }, [shift]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) return;
    
    onSubmit({
      date: date.toISOString().split('T')[0],
      type,
      notes: notes.trim()
    });
  };

  const handleTypeChange = (value: string) => {
    setType(value as 'morning' | 'afternoon' | 'night');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Datum směny *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP', { locale: cs }) : 'Vyberte datum'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Typ směny *</Label>
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Vyberte typ směny" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Ranní směna</SelectItem>
            <SelectItem value="afternoon">Odpolední směna</SelectItem>
            <SelectItem value="night">Noční směna</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Poznámky</Label>
        <Textarea
          id="notes"
          placeholder="Volitelné poznámky k směně..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Zrušit
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !date}
        >
          {isLoading ? 'Ukládám...' : shift ? 'Upravit směnu' : 'Přidat směnu'}
        </Button>
      </div>
    </form>
  );
};

export default ShiftForm;
