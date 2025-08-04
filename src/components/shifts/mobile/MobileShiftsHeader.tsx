import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addMonths, subMonths, getMonth, getYear } from 'date-fns';
import { cs, pl, de } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface MobileShiftsHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const MobileShiftsHeader: React.FC<MobileShiftsHeaderProps> = ({
  currentDate,
  onDateChange
}) => {
  const { i18n } = useTranslation();
  
  const getLocale = () => {
    switch (i18n.language) {
      case 'cs': return cs;
      case 'pl': return pl;
      case 'de': return de;
      default: return cs;
    }
  };

  const handlePreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  const monthYear = `${getMonth(currentDate) + 1}/${getYear(currentDate)}`;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePreviousMonth}
        className="h-8 w-8 text-foreground hover:bg-accent"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="text-xl font-semibold text-foreground">
        {monthYear}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextMonth}
        className="h-8 w-8 text-foreground hover:bg-accent"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MobileShiftsHeader;