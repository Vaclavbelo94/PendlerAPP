
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, TrendingUp, Plus, FileText } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { cs } from "date-fns/locale";
import QuickPromoCode from "@/components/dashboard/QuickPromoCode";

interface ShiftData {
  id: string;
  date: string;
  type: string;
  notes?: string;
}

const OverviewTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch shifts data
      const { data: shiftsData } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);

      if (shiftsData) {
        setShifts(shiftsData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate this week's hours
  const thisWeekShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return shiftDate >= weekStart && shiftDate <= weekEnd;
  });

  const thisWeekHours = thisWeekShifts.length * 8;

  // Calculate this month's shifts
  const thisMonthShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    return shiftDate >= monthStart && shiftDate <= monthEnd;
  });

  const recentShifts = shifts.slice(0, 3);

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
            <CardTitle className="text-sm font-medium">Týdenní hodiny</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekHours}</div>
            <p className="text-xs text-muted-foreground">
              {thisWeekShifts.length} směn tento týden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Měsíční směny</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthShifts.length}</div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(), "MMMM yyyy", { locale: cs })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pokrok</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((thisWeekHours / 40) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Týdenní cíl (40h)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent shifts */}
        <Card>
          <CardHeader>
            <CardTitle>Nedávné směny</CardTitle>
            <CardDescription>Vaše poslední směny</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentShifts.length > 0 ? (
              <>
                {recentShifts.map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {format(new Date(shift.date), "dd.MM.yyyy", { locale: cs })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {shift.type === "morning" ? "Ranní" : 
                         shift.type === "afternoon" ? "Odpolední" : "Noční"} směna
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
                  Zobrazit všechny směny
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Zatím nemáte žádné směny</p>
                <Button onClick={() => navigate("/shifts")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Přidat směnu
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Rychlé akce</CardTitle>
            <CardDescription>Nejčastěji používané funkce</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/shifts")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Přidat novou směnu
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/vocabulary")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Procvičovat slovíčka
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/calculator")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Kalkulačka mezd
            </Button>
            
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/tax-advisor")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Daňový poradce
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
