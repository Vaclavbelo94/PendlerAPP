
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Download, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shift } from './types';
import { 
  generateShiftEvents, 
  generateICSContent, 
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  downloadFile 
} from '@/utils/calendarUtils';
import { toast } from '@/components/ui/use-toast';

interface CalendarExportProps {
  shifts: Shift[];
}

export const CalendarExport: React.FC<CalendarExportProps> = ({ shifts }) => {
  const handleICSExport = () => {
    try {
      const events = generateShiftEvents(shifts);
      const icsContent = generateICSContent(events);
      
      downloadFile(
        icsContent, 
        'pendlerapp-smeny.ics', 
        'text/calendar;charset=utf-8'
      );
      
      toast({
        title: "Kalendář vyexportován",
        description: "Soubor .ics byl úspěšně stažen"
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Chyba při exportu",
        description: "Nepodařilo se vyexportovat kalendář",
        variant: "destructive"
      });
    }
  };

  const handleGoogleCalendarExport = () => {
    try {
      if (shifts.length === 0) {
        toast({
          title: "Žádné směny",
          description: "Nejsou k dispozici směny pro export",
          variant: "destructive"
        });
        return;
      }
      
      const events = generateShiftEvents(shifts);
      const firstEvent = events[0];
      const googleUrl = generateGoogleCalendarUrl(firstEvent);
      
      window.open(googleUrl, '_blank');
      
      toast({
        title: "Google Kalendář otevřen",
        description: "První směna byla přidána do Google Kalendáře"
      });
    } catch (error) {
      console.error("Google Calendar export error:", error);
      toast({
        title: "Chyba při exportu",
        description: "Nepodařilo se exportovat do Google Kalendáře",
        variant: "destructive"
      });
    }
  };

  const handleOutlookExport = () => {
    try {
      if (shifts.length === 0) {
        toast({
          title: "Žádné směny",
          description: "Nejsou k dispozici směny pro export",
          variant: "destructive"
        });
        return;
      }
      
      const events = generateShiftEvents(shifts);
      const firstEvent = events[0];
      const outlookUrl = generateOutlookCalendarUrl(firstEvent);
      
      window.open(outlookUrl, '_blank');
      
      toast({
        title: "Outlook Kalendář otevřen",
        description: "První směna byla přidána do Outlook Kalendáře"
      });
    } catch (error) {
      console.error("Outlook export error:", error);
      toast({
        title: "Chyba při exportu",
        description: "Nepodařilo se exportovat do Outlook Kalendáře",
        variant: "destructive"
      });
    }
  };

  if (shifts.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium mb-1">Export kalendáře</h3>
        <p className="text-sm text-muted-foreground">
          Exportujte své směny do kalendářové aplikace
        </p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Export do kalendáře
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleGoogleCalendarExport}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Google Kalendář
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOutlookExport}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Outlook Kalendář
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleICSExport}>
            <Download className="h-4 w-4 mr-2" />
            Stáhnout .ics soubor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
