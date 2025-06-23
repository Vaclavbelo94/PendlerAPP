
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface ShiftWidgetsProps {
  shifts: any[];
}

export const ShiftWidgets: React.FC<ShiftWidgetsProps> = ({ shifts }) => {
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

  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const todayShifts = shifts.filter(shift => 
    isSameDay(new Date(shift.date), today)
  );
  
  const tomorrowShifts = shifts.filter(shift => 
    isSameDay(new Date(shift.date), tomorrow)
  );

  const thisWeekShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const weekEnd = addDays(weekStart, 6);
    return shiftDate >= weekStart && shiftDate <= weekEnd;
  });

  const getShiftTypeIcon = (type: string) => {
    switch (type) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'night': return '🌙';
      default: return '⏰';
    }
  };

  const getShiftTime = (type: string) => {
    switch (type) {
      case 'morning': return '6:00';
      case 'afternoon': return '14:00';
      case 'night': return '22:00';
      default: return '';
    }
  };

  const getShiftTypeName = (type: string) => {
    switch (type) {
      case 'morning': return t('morning');
      case 'afternoon': return t('afternoon');
      case 'night': return t('night');
      default: return type;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Today's shift */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('today')}</p>
            {todayShifts.length > 0 ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{getShiftTypeIcon(todayShifts[0].type)}</span>
                <div>
                  <p className="font-medium">{getShiftTime(todayShifts[0].type)}</p>
                  <p className="text-xs text-muted-foreground">
                    {getShiftTypeName(todayShifts[0].type)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">{t('noShift')}</p>
            )}
          </div>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* Tomorrow's shift */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('tomorrow')}</p>
            {tomorrowShifts.length > 0 ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{getShiftTypeIcon(tomorrowShifts[0].type)}</span>
                <div>
                  <p className="font-medium">{getShiftTime(tomorrowShifts[0].type)}</p>
                  <p className="text-xs text-muted-foreground">
                    {getShiftTypeName(tomorrowShifts[0].type)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">{t('noShift')}</p>
            )}
          </div>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* This week total */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('thisWeek')}</p>
            <p className="text-2xl font-bold mt-1">{thisWeekShifts.length}</p>
            <p className="text-xs text-muted-foreground">{t('shifts')}</p>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* Quick status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('state')}</p>
            <p className="text-sm font-medium mt-1 text-green-600">
              {t('synchronised')}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(), 'HH:mm', { locale: getDateLocale() })}
            </p>
          </div>
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
        </div>
      </Card>
    </div>
  );
};
