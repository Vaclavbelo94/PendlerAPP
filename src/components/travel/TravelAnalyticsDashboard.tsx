
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Clock, Leaf, Car, Users } from 'lucide-react';
import { enhancedRideshareService, CommuteAnalytics } from '@/services/enhancedRideshareService';
import { useAuth } from '@/hooks/useAuth';

const TravelAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<CommuteAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user?.id]);

  const loadAnalytics = async () => {
    if (!user?.id) return;
    
    try {
      const data = await enhancedRideshareService.getCommuteAnalytics(user.id, 30);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (analytics.length === 0) return null;

    const totalCost = analytics.reduce((sum, trip) => sum + (trip.cost_amount || 0), 0);
    const totalDistance = analytics.reduce((sum, trip) => sum + (trip.distance_km || 0), 0);
    const totalTime = analytics.reduce((sum, trip) => sum + (trip.duration_minutes || 0), 0);
    const avgCostPerKm = totalDistance > 0 ? totalCost / totalDistance : 0;
    
    // CO2 savings estimation (assuming 120g CO2/km for car)
    const carTrips = analytics.filter(trip => trip.transport_mode === 'car').length;
    const rideshareTrips = analytics.filter(trip => trip.transport_mode === 'rideshare').length;
    const co2Saved = rideshareTrips * 0.12 * (totalDistance / analytics.length); // kg CO2

    return {
      totalCost,
      totalDistance,
      totalTime: Math.round(totalTime / 60), // hours
      avgCostPerKm,
      co2Saved,
      tripsCount: analytics.length,
      ridesharePercentage: rideshareTrips / analytics.length * 100
    };
  };

  const getTransportModeData = () => {
    const modes = analytics.reduce((acc, trip) => {
      const mode = trip.transport_mode;
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(modes).map(([mode, count]) => ({
      name: mode === 'car' ? 'Auto' : mode === 'rideshare' ? 'Spolujízda' : mode === 'public' ? 'MHD' : mode,
      value: count
    }));
  };

  const getCostTrendData = () => {
    const dailyCosts = analytics.reduce((acc, trip) => {
      const date = trip.travel_date;
      acc[date] = (acc[date] || 0) + (trip.cost_amount || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyCosts)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14) // Last 14 days
      .map(([date, cost]) => ({
        date: new Date(date).toLocaleDateString('cs-CZ', { month: 'short', day: 'numeric' }),
        cost: Math.round(cost)
      }));
  };

  const stats = calculateStats();
  const transportData = getTransportModeData();
  const costTrendData = getCostTrendData();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Načítám analytická data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats || analytics.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <TrendingUp className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p className="text-muted-foreground">Zatím nemáte dostatek dat pro analýzu.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Začněte používat funkce cestování pro zobrazení statistik.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Celkové náklady</p>
                <p className="text-xl font-bold">{Math.round(stats.totalCost)} Kč</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Celková vzdálenost</p>
                <p className="text-xl font-bold">{Math.round(stats.totalDistance)} km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Celkový čas</p>
                <p className="text-xl font-bold">{stats.totalTime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">CO₂ úspora</p>
                <p className="text-xl font-bold">{stats.co2Saved.toFixed(1)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="costs">Náklady</TabsTrigger>
          <TabsTrigger value="environmental">Ekologie</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Dopravní prostředky</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={transportData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {transportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Klíčové metriky</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Průměrná cena/km</span>
                  <Badge variant="outline">{stats.avgCostPerKm.toFixed(2)} Kč</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Počet cest</span>
                  <Badge variant="outline">{stats.tripsCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">% spolujízd</span>
                  <Badge variant="outline">{stats.ridesharePercentage.toFixed(1)}%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vývoj nákladů (posledních 14 dní)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={costTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cost" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Dopad na životní prostředí
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">CO₂ úspora</h4>
                  <p className="text-2xl font-bold text-green-600">{stats.co2Saved.toFixed(1)} kg</p>
                  <p className="text-sm text-green-700">Díky sdílení jízd</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Ekvivalent</h4>
                  <p className="text-lg font-bold text-blue-600">
                    {(stats.co2Saved / 0.012).toFixed(0)} km
                  </p>
                  <p className="text-sm text-blue-700">Ušetřené emisí z jednoho auta</p>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>* Výpočet je založen na průměrných emisích 120g CO₂/km pro osobní automobil</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelAnalyticsDashboard;
