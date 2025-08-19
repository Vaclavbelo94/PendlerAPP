import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Smartphone, Computer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/auth';

interface CalendarSyncComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarSyncComponent: React.FC<CalendarSyncComponentProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation('profile');
  const { toast } = useToast();
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCalendar = async (format: 'ics' | 'google') => {
    if (!user?.id) return;

    try {
      setIsExporting(true);

      // This would call an edge function to generate calendar data
      const response = await fetch('/api/export-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          userId: user.id,
          format
        })
      });

      if (!response.ok) throw new Error('Export failed');

      if (format === 'ics') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dhl-shifts-${new Date().getFullYear()}.ics`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: t('calendarExported'),
          description: t('calendarExportedDescription'),
        });
      } else {
        // Handle Google Calendar integration
        const data = await response.json();
        window.open(data.googleCalendarUrl, '_blank');
      }

      onClose();
    } catch (error) {
      console.error('Error exporting calendar:', error);
      toast({
        title: t('exportError'),
        description: t('exportErrorDescription'),
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t('exportCalendar')}
          </DialogTitle>
          <DialogDescription>
            {t('exportCalendarDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* ICS File Export */}
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <Download className="h-8 w-8 text-primary" />
              <div>
                <h4 className="font-medium">{t('downloadICSFile')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('icsFileDescription')}
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleExportCalendar('ics')}
              disabled={isExporting}
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? t('exporting') : t('downloadICS')}
            </Button>
          </div>

          {/* Google Calendar Integration */}
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium">{t('googleCalendar')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('googleCalendarDescription')}
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleExportCalendar('google')}
              disabled={isExporting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {isExporting ? t('connecting') : t('addToGoogleCalendar')}
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="flex items-start gap-2">
              <Smartphone className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('mobileUsers')}:</strong>
                <p>{t('mobileInstructions')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Computer className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('desktopUsers')}:</strong>
                <p>{t('desktopInstructions')}</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
            disabled={isExporting}
          >
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};