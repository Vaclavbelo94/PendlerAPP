import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Clock, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { routeService } from '@/services/routeService';

interface TravelStats {
  totalTrips: number;
  totalCost: number;
  totalTime: number;
  avgCostPerTrip: number;
  mostUsedRoute: string;
  co2Saved: number;
}

const TravelAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TravelStats>({
    totalTrips: 0,
    totalCost: 0,
    totalTime: 0,
    avgCostPerTrip: 0,
    mostUsedRoute: '',
    co2Saved: 0
  });
  const [savedRoutes, setSavedRoutes] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadTravelData();
    }
  }, [user?.id]);

  const loadTravelData = async () => {
    try {
      const routes = await routeService.getSavedRoutes(user.id);
      setSavedRoutes(routes);
      
      // Vypočítat statistiky z uložených tras
      const totalTrips = routes.length;
      const totalCost = routes.reduce((sum, route) => {
        return sum + (route.route_data?.cost || 0);
      }, 0);
      const totalTime = routes.reduce((sum, route) => {
        return sum + (route.route_data?.duration || 0);
      }, 0);
      
      setStats({
        totalTrips,
        totalCost,
        totalTime,
        avgCostPerTrip: totalTrips > 0 ? totalCost / totalTrips : 0,
        mostUsedRoute: routes[0]?.name || 'Žádná',
        co2Saved: routes.reduce((sum, route) => sum + (route.route_data?.co2Emissions || 0), 0)
      });
    } catch (error) {
      console.error('Error loading travel data:', error);
    }
  };

  // Mock data pro grafy
  const monthlyData = [
    { month: 'Led', trips: 12, cost: 1200, time: 480 },
    { month: 'Úno', trips: 15, cost: 1500, time: 600 },
    { month: 'Bře', trips: 18, cost: 1800, time: 720 },
    { month: 'Dub', trips: 20, cost: 2000, time: 800 },
    { month: 'Kvě', trips: 22, cost: 2200, time: 880 },
    { month: 'Čer', trips: 25, cost: 2500, time: 1000 }
  ];

  const transportModeData = [
    { name: 'Auto', value: 45, color: '#8884d8' },
    { name: 'Vlak', value: 30, color: '#82ca9d' },
    { name: 'Autobus', value: 15, color: '#ffc658' },
    { name: 'Kombinované', value: 10, color: '#ff7300' }
  ];

  const StatCard = ({ title, value, icon: Icon, subtitle }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Celkem cest"
          value={stats.totalTrips}
          icon={MapPin}
          subtitle="za posledních 6 měsíců"
        />
        <StatCard
          title="Celkové náklady"
          value={`${stats.totalCost.toLocaleString()} Kč`}
          icon={DollarSign}
          subtitle={`průměr: ${Math.round(stats.avgCostPerTrip)} Kč/cesta`}
        />
        <StatCard
          title="Celkový čas"
          value={`${Math.round(stats.totalTime / 60)} h`}
          icon={Clock}
          subtitle={`${stats.totalTime} minut celkem`}
        />
        <StatCard
          title="CO₂ emise"
          value={`${stats.co2Saved.toFixed(1)} kg`}
          icon={TrendingUp}
          subtitle="za posledních 6 měsíců"
        />
      </div>

      {/* Grafy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Měsíční statistiky */}
        <Card>
          <CardHeader>
            <CardTitle>Měsíční přehled cest</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" fill="#8884d8" name="Počet cest" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rozložení dopravních prostředků */}
        <Card>
          <CardHeader>
            <CardTitle>Využití dopravních prostředků</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transportModeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transportModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend nákladů */}
        <Card>
          <CardHeader>
            <CardTitle>Vývoj nákladů na dopravu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Náklady (Kč)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Čas strávený cestováním */}
        <Card>
          <CardHeader>
            <CardTitle>Čas strávený cestováním</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#82ca9d" name="Čas (minuty)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TravelAnalytics;
