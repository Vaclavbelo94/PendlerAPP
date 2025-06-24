
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMonthlyEarnings } from "@/hooks/useMonthlyEarnings";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, TrendingUp, Plus, FileText } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { cs } from "date-fns/locale";
import QuickPromoCode from "@/components/dashboard/QuickPromoCode";
import { useTranslation } from 'react-i18next';

interface ShiftData {
  id: string;
  date: string;
  type: string;
  notes?: string;
}

const OverviewTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(['dashboard', 'ui']);
  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    amount: monthlyEarnings, 
    hoursWorked: monthlyHours,
    hasWageSet,
    isLoading: earningsLoading 
  } = useMonthlyEarnings();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setShifts([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data: shiftsData, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error("Error fetching shifts:", error);
        setShifts([]);
      } else if (shiftsData) {
        const formattedShifts = shiftsData.map(shift => ({
          ...shift,
          date: typeof shift.date === 'string' ? shift.date : new Date(shift.date).toISOString().split('T')[0]
        }));
        setShifts(formattedShifts);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setShifts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const thisWeekShifts = React.useMemo(() => {
    if (!shifts || shifts.length === 0) return [];
    
    try {
      return shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        if (isNaN(shiftDate.getTime())) return false;
        
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
        return shiftDate >= weekStart && shiftDate <= weekEnd;
      });
    } catch (error) {
      console.error("Error calculating this week's shifts:", error);
      return [];
    }
  }, [shifts]);

  const thisWeekHours = thisWeekShifts.length * 8;

  const thisMonthShifts = React.useMemo(() => {
    if (!shifts || shifts.length === 0) return [];
    
    try {
      return shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        if (isNaN(shiftDate.getTime())) return false;
        
        const monthStart = startOfMonth(new Date());
        const monthEnd = endOfMonth(new Date());
        return shiftDate >= monthStart && shiftDate <= monthEnd;
      });
    } catch (error) {
      console.error("Error calculating this month's shifts:", error);
      return [];
    }
  }, [shifts]);

  const recentShifts = React.useMemo(() => {
    return shifts.slice(0, 3);
  }, [shifts]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard:weeklyHours')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekHours}</div>
            <p className="text-xs text-muted-foreground">
              {thisWeekShifts.length} {t('dashboard:shiftsThisWeek')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard:monthlyEarningsTitle')}</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earningsLoading ? '...' : 
                hasWageSet ? monthlyEarnings.toLocaleString('de-DE', { 
                  style: 'currency', 
                  currency: 'EUR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }) : t('dashboard:notSet')
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {hasWageSet ? `${monthlyHours}h ${t('dashboard:thisMonth')}` : t('dashboard:setWageInProfile')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard:progress')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {thisWeekHours > 0 ? Math.round((thisWeekHours / 30) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard:weeklyTarget')} (30h)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent shifts */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard:recentShifts')}</CardTitle>
            <CardDescription>{t('dashboard:yourRecentShifts')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentShifts.length > 0 ? (
              <>
                {recentShifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {(() => {
                          try {
                            return format(new Date(shift.date), "dd.MM.yyyy", { locale: cs });
                          } catch (error) {
                            console.error("Error formatting date:", error, shift.date);
                            return shift.date;
                          }
                        })()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {shift.type === "morning" ? t('dashboard:morningShift') : 
                         shift.type === "afternoon" ? t('dashboard:afternoonShift') : t('dashboard:nightShift')}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      8h
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/shifts")}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {t('dashboard:viewAllShifts')}
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">{t('dashboard:noShiftsYet')}</p>
                <Button onClick={() => navigate("/shifts")}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('dashboard:addShift')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard:quickActions')}</CardTitle>
            <CardDescription>{t('dashboard:mostUsedFeatures')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/shifts")}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard:addShift')}
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/language?tab=vocabulary")}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard:practiceVocabulary')}
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/calculator")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              {t('dashboard:salaryCalculator')}
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/tax-advisor")}
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('dashboard:taxAdvisor')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Promo code widget for non-premium users */}
      <QuickPromoCode />
    </div>
  );
};

export default OverviewTab;
