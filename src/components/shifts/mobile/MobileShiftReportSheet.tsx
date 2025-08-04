import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Calendar, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cs, pl, de } from 'date-fns/locale';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

interface MobileShiftReportSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  date?: Date;
  shift?: any;
}

const MobileShiftReportSheet: React.FC<MobileShiftReportSheetProps> = ({
  isOpen,
  onOpenChange,
  date,
  shift
}) => {
  const { t, i18n } = useTranslation('shifts');
  const { success, error } = useStandardizedToast();
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getLocale = () => {
    switch (i18n.language) {
      case 'cs': return cs;
      case 'pl': return pl;
      case 'de': return de;
      default: return cs;
    }
  };

  const issueTypes = [
    {
      id: 'missing_schedule',
      label: t('mobile.reportTypes.missingSchedule', 'Nepřišel rozpis'),
      icon: Calendar,
      color: 'bg-orange-100 text-orange-800 border-orange-200'
    },
    {
      id: 'wrong_shift',
      label: t('mobile.reportTypes.wrongShift', 'Chyba ve směně'),
      icon: Clock,
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      id: 'schedule_conflict',
      label: t('mobile.reportTypes.scheduleConflict', 'Konflikt v rozpisu'),
      icon: AlertTriangle,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  ];

  const handleSubmit = async () => {
    if (!selectedIssue) {
      error('Chyba', 'Vyberte typ problému');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call for reporting issue
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      success('Nahlášení odesláno', 'Váš report byl úspěšně odeslán HR oddělení');
      
      // Reset form
      setSelectedIssue('');
      setDescription('');
      onOpenChange(false);
    } catch (err) {
      error('Chyba', 'Nepodařilo se odeslat nahlášení');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = date ? format(date, 'PPP', { locale: getLocale() }) : '';

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t('mobile.reportChange', 'Nahlásit změnu')}
          </SheetTitle>
          <SheetDescription>
            {t('mobile.reportDescription', 'Nahlaste problém s rozpisem směn vašemu HR oddělení')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Date and shift info */}
          {date && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{formattedDate}</div>
                    {shift && (
                      <div className="text-sm text-muted-foreground">
                        {shift.start_time} – {shift.end_time}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Issue type selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">
              {t('mobile.selectIssueType', 'Vyberte typ problému')}
            </h3>
            
            <div className="space-y-2">
              {issueTypes.map((issue) => {
                const Icon = issue.icon;
                const isSelected = selectedIssue === issue.id;
                
                return (
                  <Card 
                    key={issue.id} 
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary' : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedIssue(issue.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{issue.label}</span>
                        {isSelected && (
                          <Badge variant="default" className="ml-auto">
                            {t('mobile.selected', 'Vybráno')}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">
              {t('mobile.additionalDetails', 'Dodatečné informace')} 
              <span className="text-muted-foreground font-normal ml-1">
                ({t('optional', 'volitelné')})
              </span>
            </h3>
            
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('mobile.descriptionPlaceholder', 'Popište problém podrobněji...')}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Submit button */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              {t('cancel', 'Zrušit')}
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={!selectedIssue || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t('mobile.sending', 'Odesílám...')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t('mobile.sendReport', 'Odeslat nahlášení')}
                </div>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileShiftReportSheet;