
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shift } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

interface CalendarExportProps {
  shifts: Shift[];
}

export const CalendarExport: React.FC<CalendarExportProps> = ({ shifts }) => {
  
  const generateICSContent = (shifts: Shift[]) => {
    const getShiftTime = (type: string) => {
      switch (type) {
        case 'morning': return { start: '06:00', end: '14:00' };
        case 'afternoon': return { start: '14:00', end: '22:00' };
        case 'night': return { start: '22:00', end: '06:00' };
        default: return { start: '08:00', end: '16:00' };
      }
    };

    const getShiftTitle = (type: string) => {
      switch (type) {
        case 'morning': return 'Ranní směna';
        case 'afternoon': return 'Odpolední směna';
        case 'night': return 'Noční směna';
        default: return 'Směna';
      }
    };

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Pendlerův Pomocník//Směny//CS',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ].join('\r\n');

    shifts.forEach(shift => {
      const shiftTime = getShiftTime(shift.type);
      const shiftDate = new Date(shift.date);
      const startDateTime = new Date(shiftDate);
      const endDateTime = new Date(shiftDate);
      
      // Set start time
      const [startHour, startMinute] = shiftTime.start.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
      
      // Set end time
      const [endHour, endMinute] = shiftTime.end.split(':');
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
      
      // If night shift, end time is next day
      if (shift.type === 'night') {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }

      const formatDateForICS = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icsContent += '\r\n' + [
        'BEGIN:VEVENT',
        `UID:shift-${shift.id}-${Date.now()}@pendleruv-pomocnik.cz`,
        `DTSTART:${formatDateForICS(startDateTime)}`,
        `DTEND:${formatDateForICS(endDateTime)}`,
        `SUMMARY:${getShiftTitle(shift.type)}`,
        shift.notes ? `DESCRIPTION:${shift.notes.replace(/\n/g, '\\n')}` : '',
        `CREATED:${formatDateForICS(new Date())}`,
        `LAST-MODIFIED:${formatDateForICS(new Date())}`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'END:VEVENT'
      ].filter(Boolean).join('\r\n');
    });

    icsContent += '\r\nEND:VCALENDAR';
    return icsContent;
  };

  const exportToICS = () => {
    if (shifts.length === 0) {
      toast({
        title: "Žádné směny",
        description: "Nejsou k dispozici žádné směny pro export",
        variant: "destructive"
      });
      return;
    }

    try {
      const icsContent = generateICSContent(shifts);
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'smeny-kalendar.ics');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Kalendář exportován",
        description: `Exportováno ${shifts.length} směn do kalendáře`
      });
    } catch (error) {
      console.error('Chyba při exportu kalendáře:', error);
      toast({
        title: "Chyba při exportu",
        description: "Nepodařilo se exportovat kalendář",
        variant: "destructive"
      });
    }
  };

  const exportToGoogleCalendar = () => {
    if (shifts.length === 0) {
      toast({
        title: "Žádné směny",
        description: "Nejsou k dispozici žádné směny pro export",
        variant: "destructive"
      });
      return;
    }

    // For Google Calendar, we'll create a URL for the first shift as an example
    const firstShift = shifts[0];
    const shiftDate = new Date(firstShift.date);
    
    const getShiftTime = (type: string) => {
      switch (type) {
        case 'morning': return { start: '06:00', end: '14:00' };
        case 'afternoon': return { start: '14:00', end: '22:00' };
        case 'night': return { start: '22:00', end: '06:00' };
        default: return { start: '08:00', end: '16:00' };
      }
    };

    const shiftTime = getShiftTime(firstShift.type);
    const startDateTime = new Date(shiftDate);
    const endDateTime = new Date(shiftDate);
    
    const [startHour, startMinute] = shiftTime.start.split(':');
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
    
    const [endHour, endMinute] = shiftTime.end.split(':');
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
    
    if (firstShift.type === 'night') {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const title = firstShift.type === 'morning' ? 'Ranní směna' : 
                  firstShift.type === 'afternoon' ? 'Odpolední směna' : 'Noční směna';
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${encodeURIComponent(firstShift.notes || '')}`;
    
    window.open(googleUrl, '_blank');
    
    toast({
      title: "Google Kalendář otevřen",
      description: "První směna byla připravena pro přidání do Google Kalendáře"
    });
  };

  if (shifts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <p>Nejsou k dispozici žádné směny pro export do kalendáře</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Exportovat do kalendáře
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
      
      <p className="text-sm text-muted-foreground">
        Exportuje {shifts.length} směn s automaticky nastavenými časy podle typu směny.
      </p>
    </div>
  );
};
