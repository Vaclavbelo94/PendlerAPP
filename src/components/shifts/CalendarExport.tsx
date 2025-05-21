
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shift } from './types';
import { 
  generateICSContent, 
  downloadFile, 
  generateGoogleCalendarUrl, 
  CalendarEvent
} from '@/utils/calendarUtils';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface CalendarExportProps {
  shifts: Shift[];
}

export const CalendarExport: React.FC<CalendarExportProps> = ({ shifts }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  // Convert shifts to calendar events format
  const convertShiftsToEvents = (): CalendarEvent[] => {
    return shifts.map((shift) => {
      const shiftDate = shift.date instanceof Date ? shift.date : new Date(shift.date);
      const shiftTypeMap: Record<string, string> = {
        'morning': 'Ranní směna (6:00 - 14:00)',
        'afternoon': 'Odpolední směna (14:00 - 22:00)',
        'night': 'Noční směna (22:00 - 6:00)'
      };
      
      return {
        title: shiftTypeMap[shift.type] || `${shift.type.charAt(0).toUpperCase() + shift.type.slice(1)} směna`,
        description: shift.notes ? `Poznámky: ${shift.notes}` : 'Naplánovaná směna',
        startDate: shiftDate,
        location: 'Pracoviště'
      };
    });
  };
  
  // Export to ICS file (for Apple Calendar, Outlook, etc)
  const exportToICS = () => {
    try {
      setIsExporting(true);
      const events = convertShiftsToEvents();
      const icsContent = generateICSContent(events);
      
      const currentDate = format(new Date(), 'yyyy-MM-dd', { locale: cs });
      downloadFile(
        icsContent, 
        `pendlerhelfer-smeny-${currentDate}.ics`, 
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
    } finally {
      setIsExporting(false);
    }
  };
  
  // Export to Google Calendar
  const exportToGoogleCalendar = () => {
    try {
      if (shifts.length === 0) {
        toast({
          title: "Žádné směny",
          description: "Nejsou k dispozici žádné směny pro export",
          variant: "destructive"
        });
        return;
      }
      
      // Just export the nearest upcoming shift to Google Calendar
      const events = convertShiftsToEvents();
      const upcomingEvents = events.filter(e => e.startDate >= new Date())
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      
      if (upcomingEvents.length === 0) {
        // If no upcoming events, use the most recent one
        const gcalUrl = generateGoogleCalendarUrl(events[0]);
        window.open(gcalUrl, '_blank');
      } else {
        // Open Google Calendar with the next upcoming shift
        const gcalUrl = generateGoogleCalendarUrl(upcomingEvents[0]);
        window.open(gcalUrl, '_blank');
      }
      
      toast({
        title: "Google Kalendář otevřen",
        description: "Směna byla přidána do Google Kalendáře"
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
  
  // Export all shifts to Google Calendar (batch export)
  const exportAllToGoogleCalendar = () => {
    try {
      if (shifts.length === 0) {
        toast({
          title: "Žádné směny",
          description: "Nejsou k dispozici žádné směny pro export",
          variant: "destructive"
        });
        return;
      }
      
      const events = convertShiftsToEvents();
      
      // Show a message about the process
      toast({
        title: "Export více směn",
        description: "Kalendář se otevře postupně pro každou směnu. Potvrďte přidání každé směny."
      });
      
      // Process only up to 5 upcoming shifts to avoid overwhelming the user
      const upcomingEvents = events
        .filter(e => e.startDate >= new Date())
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
        .slice(0, 5);
      
      if (upcomingEvents.length === 0) {
        // If no upcoming events, use the most recent one
        const gcalUrl = generateGoogleCalendarUrl(events[0]);
        window.open(gcalUrl, '_blank');
      } else {
        // Process the first event immediately
        const firstUrl = generateGoogleCalendarUrl(upcomingEvents[0]);
        window.open(firstUrl, '_blank');
        
        // Process remaining events with a delay to prevent popup blocking
        if (upcomingEvents.length > 1) {
          let index = 1;
          const processNext = () => {
            if (index < upcomingEvents.length) {
              const url = generateGoogleCalendarUrl(upcomingEvents[index]);
              window.open(url, '_blank');
              index++;
              if (index < upcomingEvents.length) {
                setTimeout(processNext, 2000);
              }
            }
          };
          setTimeout(processNext, 2000);
        }
      }
    } catch (error) {
      console.error("Chyba při exportu do Google Kalendáře:", error);
      toast({
        title: "Chyba při exportu",
        description: "Nepodařilo se exportovat do Google Kalendáře",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Export směn do kalendáře</h3>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportToICS}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Stáhnout .ics soubor</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="default" 
                className="flex items-center gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Google Kalendář</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToGoogleCalendar}>
                Přidat nejbližší směnu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportAllToGoogleCalendar}>
                Přidat více směn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>Exportujte své směny do kalendáře pro jednodušší plánování.</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Stáhněte .ics soubor pro import do Apple Kalendáře nebo Outlooku</li>
          <li>Přidejte směny přímo do Google Kalendáře</li>
          <li>Synchronizujte svůj pracovní rozvrh s osobním kalendářem</li>
        </ul>
      </div>
    </div>
  );
};
