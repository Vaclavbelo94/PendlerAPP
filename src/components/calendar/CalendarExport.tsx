import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AmortizationRow } from '@/hooks/useAmortizationSchedule';
import { 
  generateICSContent, 
  downloadFile, 
  generateGoogleCalendarUrl, 
  generateAmortizationEvents,
  CalendarEvent
} from '@/utils/calendarUtils';
import { toast } from '@/components/ui/use-toast';

interface CalendarExportProps {
  schedule: AmortizationRow[];
  loanAmount: number;
  monthlyPayment: number;
}

const CalendarExport: React.FC<CalendarExportProps> = ({ 
  schedule, 
  loanAmount, 
  monthlyPayment 
}) => {
  // Create payment dates - one date per month starting from current date
  const generatePaymentDates = () => {
    const startDate = new Date();
    return schedule.map((row, index) => {
      // Create a date for this payment (current date + index months)
      const paymentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + row.period,
        startDate.getDate()
      );
      
      return {
        ...row,
        date: paymentDate
      };
    });
  };
  
  // Export to ICS file (for Apple Calendar, Outlook, etc)
  const exportToICS = () => {
    try {
      const scheduleWithDates = generatePaymentDates();
      const events = generateAmortizationEvents(scheduleWithDates, loanAmount, monthlyPayment);
      const icsContent = generateICSContent(events);
      
      downloadFile(
        icsContent, 
        'pendlerhelfer-splatky.ics', 
        'text/calendar;charset=utf-8'
      );
      
      toast({
        title: "Kalendář vytvořen",
        description: "Soubor s kalendářem byl úspěšně vytvořen"
      });
    } catch (error) {
      console.error("Chyba při exportu kalendáře:", error);
      toast({
        title: "Chyba při exportu",
        description: "Nepodařilo se vytvořit kalendář",
        variant: "destructive"
      });
    }
  };
  
  // Export to Google Calendar
  const exportToGoogleCalendar = () => {
    try {
      if (schedule.length === 0) {
        toast({
          title: "Žádné splátky",
          description: "Nejsou k dispozici žádné splátky pro export",
          variant: "destructive"
        });
        return;
      }
      
      // For Google Calendar, we'll open just the first payment to keep it simple
      const scheduleWithDates = generatePaymentDates();
      const events = generateAmortizationEvents(scheduleWithDates, loanAmount, monthlyPayment);
      
      // Open Google Calendar with the first payment
      // Note: Google Calendar has limits on URL length, so we can't add all payments at once
      const gcalUrl = generateGoogleCalendarUrl(events[0]);
      window.open(gcalUrl, '_blank');
      
      toast({
        title: "Google Kalendář otevřen",
        description: "První splátka byla přidána do Google Kalendáře"
      });
    } catch (error) {
      console.error("Chyba při exportu do Google Kalendáře:", error);
      toast({
        title: "Chyba při exportu",
        description: "Nepodařilo se exportovat do Google Kalendáře",
        variant: "destructive"
      });
    }
  };
  
  if (schedule.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Přidat do kalendáře</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={exportToGoogleCalendar}>
            Google Kalendář
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToICS}>
            Apple Kalendář / Outlook (.ics)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CalendarExport;
