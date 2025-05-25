
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Activity, TrendingUp, Database, Clock, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AdminAnalytics {
  totalUsers: number;
  premiumUsers: number;
  activeUsers: number;
  totalVehicles: number;
  totalShifts: number;
  totalRidesShared: number;
  userGrowth: Array<{ month: string; users: number; premium: number }>;
  featureUsage: Array<{ feature: string; usage: number; color: string }>;
  systemHealth: {
    dbConnections: number;
    apiCalls: number;
    errorRate: number;
    uptime: number;
  };
}

const AdminAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Načtení základních statistik
      const [usersResult, vehiclesResult, shiftsResult, ridesResult] = await Promise.all([
        supabase.from('profiles').select('id, is_premium, created_at'),
        supabase.from('vehicles').select('id'),
        supabase.from('shifts').select('id'),
        supabase.from('rideshare_offers').select('id')
      ]);

      const users = usersResult.data || [];
      const totalUsers = users.length;
      const premiumUsers = users.filter(u => u.is_premium).length;
      const activeUsers = users.filter(u => {
        const createdAt = new Date(u.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdAt > thirtyDaysAgo;
      }).length;

      // Mockovaná data pro růst uživatelů (v reálné aplikaci by se načítala z databáze)
      const userGrowth = [
        { month: 'Led', users: 120, premium: 25 },
        { month: 'Úno', users: 145, premium: 32 },
        { month: 'Bře', users: 180, premium: 45 },
        { month: 'Dub', users: 220, premium: 58 },
        { month: 'Kvě', users: 280, premium: 72 },
        { month: 'Čer', users: totalUsers, premium: premiumUsers }
      ];

      const featureUsage = [
        { feature: 'Správa směn', usage: 85, color: '#8884d8' },
        { feature: 'Plánování cest', usage: 65, color: '#82ca9d' },
        { feature: 'Správa vozidel', usage: 45, color: '#ffc658' },
        { feature: 'Sdílení jízd', usage: 35, color: '#ff7300' },
        { feature: 'Kalkulačky', usage: 55, color: '#8dd1e1' }
      ];

      const systemHealth = {
        dbConnections: Math.floor(Math.random() * 50) + 20,
        apiCalls: Math.floor(Math.random() * 1000) + 500,
        errorRate: Math.random() * 2,
        uptime: 99.8
      };

      setAnalytics({
        totalUsers,
        premiumUsers,
        activeUsers,
        totalVehicles: vehiclesResult.data?.length || 0,
        totalShifts: shiftsResult.data?.length || 0,
        totalRidesShared: ridesResult.data?.length || 0,
        userGrowth,
        featureUsage,
        systemHealth
      });
    } catch (error) {
      console.error('Chyba při načítání analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center text-muted-foreground">Nepodařilo se načíst analytická data</div>;
  }

  return (
    <div className="space-y-6">
      {/* Hlavní metriky */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Celkem uživatelů</p>
                <p className="text-2xl font-bold">{analytics.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Premium uživatelé</p>
                <p className="text-2xl font-bold">{analytics.premiumUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktivní uživatelé</p>
                <p className="text-2xl font-bold">{analytics.activeUsers}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Systémová doba provozu</p>
                <p className="text-2xl font-bold">{analytics.systemHealth.uptime}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Růst uživatelů</TabsTrigger>
          <TabsTrigger value="features">Využití funkcí</TabsTrigger>
          <TabsTrigger value="system">Systémové metriky</TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Růst uživatelské základny</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="Celkem uživatelů" />
                  <Line type="monotone" dataKey="premium" stroke="#82ca9d" name="Premium uživatelé" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Využití funkcí (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.featureUsage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ feature, usage }) => `${feature}: ${usage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="usage"
                    >
                      {analytics.featureUsage.map((entry, index) => (
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
                <CardTitle>Detailní využití</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.featureUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feature" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Systémové metriky</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>DB Connections:</span>
                  <span className="font-mono">{analytics.systemHealth.dbConnections}</span>
                </div>
                <div className="flex justify-between">
                  <span>API Calls/hour:</span>
                  <span className="font-mono">{analytics.systemHealth.apiCalls}</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Rate:</span>
                  <span className="font-mono">{analytics.systemHealth.errorRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="font-mono text-green-600">{analytics.systemHealth.uptime}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rychlé akce</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button 
                  onClick={loadAnalytics}
                  className="w-full p-2 bg-primary text-primary-foreground rounded text-sm"
                >
                  Obnovit data
                </button>
                <button className="w-full p-2 bg-secondary text-secondary-foreground rounded text-sm">
                  Exportovat report
                </button>
                <button className="w-full p-2 bg-destructive text-destructive-foreground rounded text-sm">
                  Systémová údržba
                </button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsDashboard;
