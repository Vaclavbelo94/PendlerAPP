import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Clock, MapPin, DollarSign, Activity, Calendar } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { trafficService } from '@/services/trafficService';
import { useTranslation } from 'react-i18next';

interface TravelStats {
  total_trips: number;
  total_distance: number;
  total_time: number;
  total_cost: number;
  co2_saved: number;
  most_used_route: string;
  average_rating: number;
}

export const TravelAnalyticsDashboard: React.FC = () => {
  const { user } = useAuthState();
  const { t } = useTranslation('travel');
  const [stats, setStats] = useState<TravelStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [routeData, setRouteData] = useState<any[]>([]);
  const [transportModeData, setTransportModeData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAnalyticsData();
    }
  }, [user?.id]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Load analytics data
      const analytics = await trafficService.getRouteAnalytics(user!.id);
      
      // Mock comprehensive data for demonstration
      const mockStats: TravelStats = {
        total_trips: 156,
        total_distance: 24680,
        total_time: 2340, // minutes
        total_cost: 892.50,
        co2_saved: 125.6,
        most_used_route: 'Praha → Dresden',
        average_rating: 4.3
      };

      const mockWeeklyData = [
        { week: 'W1', trips: 12, distance: 1850, cost: 78.20, time: 180 },
        { week: 'W2', trips: 15, distance: 2120, cost: 89.50, time: 205 },
        { week: 'W3', trips: 10, distance: 1560, cost: 65.80, time: 155 },
        { week: 'W4', trips: 18, distance: 2890, cost: 112.30, time: 295 },
        { week: 'W5', trips: 14, distance: 1980, cost: 82.40, time: 185 },
        { week: 'W6', trips: 16, distance: 2340, cost: 95.60, time: 220 }
      ];

      const mockRouteData = [
        { route: 'Praha → Dresden', trips: 45, avg_time: 95, avg_cost: 12.50 },
        { route: 'Karlovy Vary → Nürnberg', trips: 32, avg_time: 180, avg_cost: 28.90 },
        { route: 'Plzeň → München', trips: 28, avg_time: 220, avg_cost: 34.80 },
        { route: 'Brno → Wien', trips: 25, avg_time: 140, avg_cost: 18.60 },
        { route: 'Ostrava → Kraków', trips: 18, avg_time: 160, avg_cost: 22.40 }
      ];

      const mockTransportData = [
        { mode: 'Auto', value: 60, color: '#8884d8' },
        { mode: 'Spolujízda', value: 25, color: '#82ca9d' },
        { mode: 'Vlak', value: 12, color: '#ffc658' },
        { mode: 'Bus', value: 3, color: '#ff7300' }
      ];

      setStats(mockStats);
      setWeeklyData(mockWeeklyData);
      setRouteData(mockRouteData);
      setTransportModeData(mockTransportData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Celkem cest</p>
                <p className="text-2xl font-bold">{stats.total_trips}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <Badge variant="secondary" className="mt-2">
              +12% tento měsíc
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vzdálenost</p>
                <p className="text-2xl font-bold">{stats.total_distance.toLocaleString()} km</p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
            <Badge variant="secondary" className="mt-2">
              Průměr: 158 km/cesta
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Celkový čas</p>
                <p className="text-2xl font-bold">{Math.round(stats.total_time / 60)}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
            <Badge variant="secondary" className="mt-2">
              Průměr: {Math.round(stats.total_time / stats.total_trips)} min/cesta
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Celkové náklady</p>
                <p className="text-2xl font-bold">€{stats.total_cost}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
            <Badge variant="secondary" className="mt-2">
              Průměr: €{(stats.total_cost / stats.total_trips).toFixed(2)}/cesta
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trendy</TabsTrigger>
          <TabsTrigger value="routes">Trasy</TabsTrigger>
          <TabsTrigger value="transport">Doprava</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Týdenní přehled cest</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="trips" stroke="#8884d8" name="Počet cest" />
                    <Line type="monotone" dataKey="time" stroke="#82ca9d" name="Čas (min)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Náklady v čase</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cost" fill="#ffc658" name="Náklady (€)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nejpoužívanější trasy</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={routeData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="route" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="trips" fill="#8884d8" name="Počet cest" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transport" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rozdělení dopravních prostředků</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transportModeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ mode, value }) => `${mode}: ${value}%`}
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

            <Card>
              <CardHeader>
                <CardTitle>Environmentální dopad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">CO₂ ušetřeno</p>
                    <p className="text-2xl font-bold text-green-900">{stats.co2_saved} kg</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Spolujízda vs. solo jízda</span>
                    <span className="font-medium">-35% emisí</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Veřejná doprava</span>
                    <span className="font-medium">-60% emisí</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Optimalizované trasy</span>
                    <span className="font-medium">-12% emisí</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelAnalyticsDashboard;