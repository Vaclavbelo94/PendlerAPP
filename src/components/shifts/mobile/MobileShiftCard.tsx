import React from 'react';
import { format, isSameDay } from 'date-fns';
import { cs, pl, de } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Shift } from '@/types/shifts';

interface MobileShiftCardProps {
  date: Date;
  shift?: Shift;
  onEdit?: (shift: Shift) => void;
  onDelete?: (shiftId: string) => void;
  onReport?: (date: Date) => void;
  isOfficialSchedule?: boolean;
}

const MobileShiftCard: React.FC<MobileShiftCardProps> = ({
  date,
  shift,
  onEdit,
  onDelete,
  onReport,
  isOfficialSchedule = false
}) => {
  const { i18n, t } = useTranslation('shifts');
  
  const getLocale = () => {
    switch (i18n.language) {
      case 'cs': return cs;
      case 'pl': return pl;
      case 'de': return de;
      default: return cs;
    }
  };

  const getShiftTypeLabel = (type: string) => {
    switch (type) {
      case 'morning': return t('morning', 'Ranní');
      case 'afternoon': return t('afternoon', 'Odpolední');
      case 'night': return t('night', 'Noční');
      case 'custom': return t('customShift', 'Vlastní');
      default: return type;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-blue-500 hover:bg-blue-600';
      case 'afternoon': return 'bg-orange-500 hover:bg-orange-600';
      case 'night': return 'bg-purple-500 hover:bg-purple-600';
      case 'custom': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-400 hover:bg-gray-500';
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  };

  const dayName = format(date, 'EEEE', { locale: getLocale() });
  const dateString = format(date, 'd. M. yyyy', { locale: getLocale() });
  const dayAbbrev = format(date, 'EEE', { locale: getLocale() });
  const isToday = isSameDay(date, new Date());

  return (
    <Card className={cn(
      "mb-3 transition-all duration-200",
      isToday && "ring-2 ring-primary",
      shift ? "hover:shadow-md" : "opacity-75"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Date and day */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-foreground">
                {dayAbbrev} {dateString}
              </span>
              {isToday && (
                <Badge variant="outline" className="text-xs">
                  {t('today', 'Dnes')}
                </Badge>
              )}
            </div>

            {/* Shift details or free day */}
            {shift ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    getShiftTypeColor(shift.type).split(' ')[0]
                  )} />
                  <span className="font-medium text-foreground">
                    {getShiftTypeLabel(shift.type)}
                  </span>
                  {isOfficialSchedule && (
                    <Badge variant="secondary" className="text-xs">
                      {t('mobile.officialSchedule', 'Oficiální rozpis')}
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {formatTime(shift.start_time)} – {formatTime(shift.end_time)}
                </div>

                {shift.notes && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    {shift.notes}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-muted-foreground">
                  {t('mobile.freeDay', 'Volno')}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {isOfficialSchedule && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onReport?.(date)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <AlertCircle className="h-4 w-4" />
              </Button>
            )}
            
            {shift && !isOfficialSchedule && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(shift)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileShiftCard;