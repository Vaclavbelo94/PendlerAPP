import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, Clock, BookOpen, Calculator, Car, Map } from "lucide-react";
import { ResponsiveAdSense } from "@/components/ads/ResponsiveAdSense";
import { AdSenseBanner } from "@/components/ads/AdSenseBanner";
import { useAdSense } from "@/components/ads/AdSenseProvider";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalShifts: number;
  monthlyEarnings: number;
  totalVehicles: number;
  averageFuelCost: number;
  totalRoutes: number;
}

const Dashboard = () => {
  const { user, isPremium } = useAuth();
  const { shouldShowAds } = useAdSense();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalShifts: 0,
    monthlyEarnings: 0,
    totalVehicles: 0,
    averageFuelCost: 0,
    totalRoutes: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const fetchUserStats = async () => {
    try {
      setIsLoading(true);

      // Fetch shifts data
      const { data: shifts } = await supabase
        .from('shifts')
        .select('*')
        .eq('user_id', user.id);

      // Fetch vehicles data
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id);

      // Fetch fuel records for average cost
      const { data: fuelRecords } = await supabase
        .from('fuel_records')
        .select('total_cost')
        .in('vehicle_id', vehicles?.map(v => v.id) || []);

      // Fetch saved routes
      const { data: routes } = await supabase
        .from('saved_routes')
        .select('*')
        .eq('user_id', user.id);

      // Calculate current month shifts
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyShifts = shifts?.filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate.getMonth() === currentMonth && shiftDate.getFullYear() === currentYear;
      }) || [];

      // Calculate average fuel cost
      const totalFuelCost = fuelRecords?.reduce((sum, record) => sum + Number(record.total_cost), 0) || 0;
      const averageFuelCost = fuelRecords?.length ? totalFuelCost / fuelRecords.length : 0;

      // Mock monthly earnings calculation (in a real app, this would be more sophisticated)
      const estimatedHourlyRate = 15; // €15/hour
      const estimatedHoursPerShift = 8;
      const monthlyEarnings = monthlyShifts.length * estimatedHoursPerShift * estimatedHourlyRate;

      setStats({
        totalShifts: shifts?.length || 0,
        monthlyEarnings,
        totalVehicles: vehicles?.length || 0,
        averageFuelCost,
        totalRoutes: routes?.length || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* AdSense Banner pro non-premium uživatele */}
      {shouldShowAds && (
        <ResponsiveAdSense 
          mobileAdSlot="1234567890"
          desktopAdSlot="0987654321"
          className="mb-6"
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Vítejte zpět, {user.user_metadata?.username || user.email?.split('@')[0]}!
          </p>
        </div>
        {isPremium && (
          <Badge className="bg-amber-500">
            <Crown className="h-4 w-4 mr-1" />
            Premium
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Měsíční výdělek</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.monthlyEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Odhad na základě směn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkem směn</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShifts}</div>
            <p className="text-xs text-muted-foreground">
              Všechny zaznamenané směny
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vozidla</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              Registrovaná vozidla
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. tankování</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.averageFuelCost.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              průměrná cena
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rychlé akce</CardTitle>
            <CardDescription>
              Nejčastěji používané funkce
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleQuickAction('/shifts')}
              >
                <Clock className="h-6 w-6" />
                <span>Přidat směnu</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleQuickAction('/calculator')}
              >
                <Calculator className="h-6 w-6" />
                <span>Kalkulačka</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleQuickAction('/vocabulary')}
              >
                <BookOpen className="h-6 w-6" />
                <span>Němčina</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleQuickAction('/vehicle')}
              >
                <Car className="h-6 w-6" />
                <span>Vozidlo</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleQuickAction('/travel')}
              >
                <Map className="h-6 w-6" />
                <span>Cesty</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleQuickAction('/tax-advisor')}
              >
                <TrendingUp className="h-6 w-6" />
                <span>Daně</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {!isPremium && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Přejít na Premium
                </CardTitle>
                <CardDescription>
                  Odemkněte všechny funkce a odstraňte reklamy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🚫</span>
                      <span className="text-xs">Bez reklam</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📚</span>
                      <span className="text-xs">Všechny lekce</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📊</span>
                      <span className="text-xs">Pokročilé statistiky</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    onClick={() => handleQuickAction('/premium')}
                  >
                    Upgradovat nyní
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sidebar AdSense pro non-premium */}
          {shouldShowAds && (
            <AdSenseBanner
              adSlot="1122334455"
              adFormat="rectangle"
              className="min-h-[250px]"
            />
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rychlý přehled</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Uložené trasy</span>
                <Badge variant="outline">{stats.totalRoutes}</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Aktivní vozidla</span>
                <Badge variant="outline">{stats.totalVehicles}</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Tento měsíc</span>
                <Badge variant="outline">{stats.monthlyEarnings > 0 ? `€${stats.monthlyEarnings}` : 'Žádné data'}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
