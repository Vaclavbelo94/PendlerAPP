
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, TrendingUp, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, isToday } from 'date-fns';
import { cs } from 'date-fns/locale';

interface Shift {
  id: string;
  date: string;
  type: string;
  notes?: string;
}

const DashboardOverview: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchShifts();
    }
  }, [user]);

  const fetchShifts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching shifts:', error);
        setShifts([]);
      } else {
        setShifts(data || []);
      }
    } catch (error) {
      console.error('Error fetching shifts:', error);
      setShifts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Find current shift (today's shift)
  const currentShift = shifts.find(shift => isToday(new Date(shift.date)));

  // Calculate this week's hours
  const thisWeekShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return shiftDate >= weekStart && shiftDate <= weekEnd;
  });

  const thisWeekHours = thisWeekShifts.length * 8; // Assuming 8 hours per shift

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="h-6 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-20 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="h-6 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-20 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Shift */}
      <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t('currentShift')}
            </CardTitle>
            {currentShift && (
              <Badge variant="default">
                {t('active')}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {currentShift ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('time')}</p>
                  <p className="font-medium">
                    {currentShift.type === 'morning' ? '06:00 - 14:00' : 
                     currentShift.type === 'afternoon' ? '14:00 - 22:00' : '22:00 - 06:00'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('location')}</p>
                  <p className="font-medium">Pracovní místo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Typ směny</p>
                  <p className="font-medium">
                    {currentShift.type === 'morning' ? 'Ranní' : 
                     currentShift.type === 'afternoon' ? 'Odpolední' : 'Noční'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Dnes nemáte naplánovanou žádnou směnu</p>
              <Button onClick={() => navigate('/shifts')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Přidat směnu
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">{t('weeklyOverview')}</CardTitle>
        </CardHeader>
        <CardContent>
          {shifts.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('hoursWorked')}</span>
                <span className="font-medium">{thisWeekHours}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Směny tento týden</span>
                <span className="font-medium">{thisWeekShifts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Celkem směn</span>
                <span className="font-medium">{shifts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('progress')}</span>
                <span className="font-medium text-green-600">
                  {Math.round((thisWeekHours / 40) * 100)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Zatím nemáte žádné směny</p>
              <Button onClick={() => navigate('/shifts')} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Přidat první směnu
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
