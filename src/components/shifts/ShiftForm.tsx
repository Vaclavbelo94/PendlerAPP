
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import DateSelector from './DateSelector';

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
    
    // Oprava: Zajišťujeme správné formátování data pro databázi
    // Používáme lokální datum bez konverze na UTC, která by mohla posunout datum
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    console.log('Submitting shift for date:', formattedDate, 'from selected date:', date);
    
    onSubmit({
      date: formattedDate,
      type,
      notes: notes.trim()
    });
  };

  const handleTypeChange = (value: string) => {
    setType(value as 'morning' | 'afternoon' | 'night');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DateSelector
        value={date}
        onChange={setDate}
        label="Datum směny"
        required
      />

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
