
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import DateSelector from './DateSelector';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('shifts');
  const [date, setDate] = useState<Date | undefined>(
    shift ? new Date(shift.date) : new Date()
  );
  const [type, setType] = useState<'morning' | 'afternoon' | 'night'>(
    shift?.type as 'morning' | 'afternoon' | 'night' || 'morning'
  );
  const [notes, setNotes] = useState(shift?.notes || '');

  useEffect(() => {
    if (shift) {
      setDate(new Date(shift.date));
      setType(shift.type as 'morning' | 'afternoon' | 'night');
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
        label={t('selectDate')}
        required
      />

      <div className="space-y-2">
        <Label htmlFor="type">{t('shiftType')} *</Label>
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('selectShiftType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">{t('morningShift')}</SelectItem>
            <SelectItem value="afternoon">{t('afternoonShift')}</SelectItem>
            <SelectItem value="night">{t('nightShift')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t('notes')}</Label>
        <Textarea
          id="notes"
          placeholder={t('optionalShiftNote')}
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
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !date}
        >
          {isLoading ? t('saving', 'Ukládám...') : shift ? t('updateShift') : t('addShift')}
        </Button>
      </div>
    </form>
  );
};

export default ShiftForm;
