
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const DashboardOverview: React.FC = () => {
  const { t } = useLanguage();

  const currentShift = {
    date: new Date().toLocaleDateString(),
    startTime: '08:00',
    endTime: '16:00',
    location: 'München, DE',
    status: 'active'
  };

  const weeklyStats = {
    hoursWorked: 32,
    plannedHours: 40,
    earnings: 1280,
    shiftsCompleted: 4
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t('currentShift') || 'Aktuální směna'}
            </CardTitle>
            <Badge variant={currentShift.status === 'active' ? 'default' : 'secondary'}>
              {t(currentShift.status) || currentShift.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('time') || 'Čas'}</p>
                <p className="font-medium">{currentShift.startTime} - {currentShift.endTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('location') || 'Místo'}</p>
                <p className="font-medium">{currentShift.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('progress') || 'Pokrok'}</p>
                <p className="font-medium">{Math.round((weeklyStats.hoursWorked / weeklyStats.plannedHours) * 100)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">{t('weeklyOverview') || 'Týdenní přehled'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('hoursWorked') || 'Odpracované hodiny'}</span>
              <span className="font-medium">{weeklyStats.hoursWorked}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('plannedHours') || 'Plánované hodiny'}</span>
              <span className="font-medium">{weeklyStats.plannedHours}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('estimatedEarnings') || 'Odhadované výdělky'}</span>
              <span className="font-medium text-green-600">€{weeklyStats.earnings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('shiftsCompleted') || 'Dokončené směny'}</span>
              <span className="font-medium">{weeklyStats.shiftsCompleted}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
