
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DateSelectorProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  required?: boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  value,
  onChange,
  label = "Datum",
  required = false
}) => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  // Initialize from value
  useEffect(() => {
    if (value) {
      setDay(value.getDate().toString());
      setMonth((value.getMonth() + 1).toString());
      setYear(value.getFullYear().toString());
    } else {
      // Set to current date by default
      const now = new Date();
      setDay(now.getDate().toString());
      setMonth((now.getMonth() + 1).toString());
      setYear(now.getFullYear().toString());
    }
  }, [value]);

  // Generate years (current year - 2 to current year + 5)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 2 + i);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Validate and update date
  const updateDate = (newDay: string, newMonth: string, newYear: string) => {
    if (newDay && newMonth && newYear) {
      const dayNum = parseInt(newDay);
      const monthNum = parseInt(newMonth);
      const yearNum = parseInt(newYear);
      
      // Check if day is valid for the selected month/year
      const maxDays = getDaysInMonth(monthNum, yearNum);
      const validDay = Math.min(dayNum, maxDays);
      
      // If day was adjusted, update the day state
      if (validDay !== dayNum) {
        setDay(validDay.toString());
      }
      
      const newDate = new Date(yearNum, monthNum - 1, validDay);
      onChange(newDate);
    }
  };

  const handleDayChange = (value: string) => {
    setDay(value);
    updateDate(value, month, year);
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);
    updateDate(day, value, year);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    updateDate(day, month, value);
  };

  const months = [
    { value: '1', label: 'Leden' },
    { value: '2', label: 'Únor' },
    { value: '3', label: 'Březen' },
    { value: '4', label: 'Duben' },
    { value: '5', label: 'Květen' },
    { value: '6', label: 'Červen' },
    { value: '7', label: 'Červenec' },
    { value: '8', label: 'Srpen' },
    { value: '9', label: 'Září' },
    { value: '10', label: 'Říjen' },
    { value: '11', label: 'Listopad' },
    { value: '12', label: 'Prosinec' }
  ];

  // Get maximum days for current month/year selection
  const maxDays = month && year ? getDaysInMonth(parseInt(month), parseInt(year)) : 31;
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  return (
    <div className="space-y-2">
      <Label htmlFor="date-selector">
        {label} {required && '*'}
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {/* Day */}
        <div>
          <Select value={day} onValueChange={handleDayChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Den" />
            </SelectTrigger>
            <SelectContent>
              {days.map((dayNum) => (
                <SelectItem key={dayNum} value={dayNum.toString()}>
                  {dayNum}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month */}
        <div>
          <Select value={month} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Měsíc" />
            </SelectTrigger>
            <SelectContent>
              {months.map((monthItem) => (
                <SelectItem key={monthItem.value} value={monthItem.value}>
                  {monthItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year */}
        <div>
          <Select value={year} onValueChange={handleYearChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Rok" />
            </SelectTrigger>
            <SelectContent>
              {years.map((yearNum) => (
                <SelectItem key={yearNum} value={yearNum.toString()}>
                  {yearNum}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
