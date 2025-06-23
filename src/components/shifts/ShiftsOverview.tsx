import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Shift } from '@/hooks/useShiftsManagement';

interface ShiftsOverviewProps {
  shifts?: Shift[];
  onEditShift?: (shift: Shift) => void;
  onDeleteShift?: (shiftId: string) => void;
}

const ShiftsOverview: React.FC<ShiftsOverviewProps> = ({ 
  shifts = [], 
  onEditShift, 
  onDeleteShift 
}) => {
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

  // Calculate weekly statistics
  const weeklyHours = thisWeekShifts.length * 8; // Assuming 8 hours per shift
  const weeklyEarnings = weeklyHours * 40; // Assuming 40€ per hour
  const plannedHours = 40;
  const efficiency = Math.round((weeklyHours / plannedHours) * 100);

  return (
    <div className="space-y-6">
      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's shift */}
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>

        {/* Tomorrow's shift */}
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>

        {/* This week total */}
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('thisWeek')}</p>
                <p className="text-2xl font-bold mt-1">{thisWeekShifts.length}</p>
                <p className="text-xs text-muted-foreground">{t('shifts')}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t('weeklyHours')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{weeklyHours}h</span>
                <span className="text-sm text-muted-foreground">{t('of')} {plannedHours}h</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((weeklyHours / plannedHours) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('efficiency')}</span>
                <Badge variant={efficiency >= 80 ? 'default' : 'secondary'}>
                  {efficiency}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t('weeklyEarnings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-green-600">€{weeklyEarnings}</span>
                <span className="text-sm text-muted-foreground">+5% vs {t('lastWeek').toLowerCase()}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('shiftsThisWeek')}</span>
                  <span className="font-medium">{thisWeekShifts.length} {t('of')} 5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('averagePerHour')}</span>
                  <span className="font-medium">€40</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent and Upcoming Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">{t('recentShifts')}</CardTitle>
          </CardHeader>
          <CardContent>
            {shifts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">{t('noShiftsYet')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {shifts.slice(0, 3).map((shift, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getShiftTypeIcon(shift.type)}</span>
                      <div>
                        <p className="font-medium">
                          {format(new Date(shift.date), 'dd.MM.yyyy', { locale: getDateLocale() })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getShiftTypeName(shift.type)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      8h
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">{t('upcomingShifts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tomorrowShifts.length > 0 ? (
                tomorrowShifts.map((shift, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getShiftTypeIcon(shift.type)}</span>
                      <div>
                        <p className="font-medium">{t('tomorrow')}</p>
                        <p className="text-xs text-muted-foreground">
                          {getShiftTypeName(shift.type)} - {getShiftTime(shift.type)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {t('tomorrow')}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm mb-4">{t('noShiftsPlannedForThisDay')}</p>
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t('addShift')}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShiftsOverview;
