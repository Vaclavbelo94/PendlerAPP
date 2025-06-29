
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, isToday, isSameDay, isValid } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ShiftFormProps {
  onSubmit: (data: any, isEdit: boolean) => void;
  onCancel: () => void;
  isLoading?: boolean;
  shift?: Shift | null;
  initialDate?: Date | null;
}

const ShiftForm: React.FC<ShiftFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  shift,
  initialDate
}) => {
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
  
  // Helper function to get the correct initial date
  const getInitialDate = (): Date => {
    if (shift) {
      console.log('ShiftForm: Using shift date:', shift.date);
      return new Date(shift.date);
    }
    if (initialDate) {
      console.log('ShiftForm: Using initialDate:', initialDate);
      return initialDate;
    }
    console.log('ShiftForm: Using current date as fallback');
    return new Date();
  };

  // Initialize state with the correct date
  const [date, setDate] = useState<Date | undefined>(getInitialDate);
  const [type, setType] = useState<'morning' | 'afternoon' | 'night'>(shift?.type || 'morning');
  const [notes, setNotes] = useState(shift?.notes || '');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isEditMode = Boolean(shift && shift.id);

  // Update form when shift or initialDate changes
  useEffect(() => {
    console.log('ShiftForm useEffect triggered:', { shift: !!shift, initialDate });
    
    if (shift) {
      console.log('ShiftForm: Updating with shift data:', shift.date);
      setDate(new Date(shift.date));
      setType(shift.type);
      setNotes(shift.notes || '');
    } else if (initialDate) {
      console.log('ShiftForm: Updating with initialDate:', initialDate);
      setDate(initialDate);
      setType('morning');
      setNotes('');
    }
  }, [shift, initialDate]);

  // Custom day component matching calendar styling
  const CustomDay = ({ date: dayDate, displayMonth, ...props }: any) => {
    if (!dayDate || !isValid(dayDate)) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground">?</span>
        </div>
      );
    }

    const isSelected = date && isSameDay(dayDate, date);
    const isTodayDate = isToday(dayDate);
    const isCurrentMonth = dayDate.getMonth() === displayMonth.getMonth();
    
    return (
      <div className="relative w-full h-full">
        <button
          {...props}
          className={cn(
            "w-full h-full p-0 font-normal relative flex items-center justify-center",
            "hover:bg-accent hover:text-accent-foreground transition-all duration-200",
            "focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            // Today styling - matching main calendar
            isTodayDate && !isSelected && "font-bold ring-2 ring-orange-400 ring-offset-1 bg-orange-50 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100",
            // Selected styling - matching main calendar
            isSelected && "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 ring-2 ring-blue-500 ring-offset-2 font-semibold shadow-md",
            // Current month vs other months
            !isCurrentMonth && "text-muted-foreground opacity-50",
            // Ensure selected overrides today
            isSelected && isTodayDate && "bg-blue-600 text-white ring-blue-500"
          )}
        >
          <span className="relative z-10">
            {dayDate.getDate()}
          </span>
        </button>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      console.error('ShiftForm: No date selected');
      return;
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    console.log('ShiftForm: Submitting shift for date:', formattedDate, 'from selected date:', date);
    
    const shiftData = {
      date: formattedDate,
      type,
      notes: notes.trim()
    };

    if (isEditMode && shift) {
      onSubmit({
        id: shift.id,
        user_id: shift.user_id,
        created_at: shift.created_at,
        updated_at: shift.updated_at,
        ...shiftData
      }, true);
    } else {
      onSubmit(shiftData, false);
    }
  };

  const handleTypeChange = (value: string) => {
    setType(value as 'morning' | 'afternoon' | 'night');
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">{t('selectDate')} *</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'dd. MMMM yyyy', { locale: getDateLocale() }) : t('selectDate')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {/* Legend for form calendar */}
            <div className="p-3 border-b bg-muted/30">
              <div className="flex flex-wrap gap-3 items-center justify-center text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded ring-2 ring-orange-400 bg-orange-50 dark:bg-orange-950/30"></div>
                  <span className="text-muted-foreground">Dnes</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-600"></div>
                  <span className="text-muted-foreground">Vybraný</span>
                </div>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={getDateLocale()}
              components={{
                Day: CustomDay
              }}
              className="w-full mx-auto pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">{t('shiftType')} *</Label>
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder={t('selectShiftType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                {t('morningShift')}
              </div>
            </SelectItem>
            <SelectItem value="afternoon">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-500"></div>
                {t('afternoonShift')}
              </div>
            </SelectItem>
            <SelectItem value="night">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-indigo-500"></div>
                {t('nightShift')}
              </div>
            </SelectItem>
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
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? t('saving') : isEditMode ? t('updateShift') : t('addShift')}
        </Button>
      </div>
    </form>
  );
};

export default ShiftForm;
