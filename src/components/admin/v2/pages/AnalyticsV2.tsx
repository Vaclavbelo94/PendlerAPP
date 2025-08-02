import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Download,
  RefreshCw
} from 'lucide-react';

export const AnalyticsV2: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCompany, setSelectedCompany] = useState('all');

  // Analytics queries
  const { data: userStats, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['analytics-users', timeRange],
    queryFn: async () => {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, created_at, company, is_premium, is_admin')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const totalUsers = users.length;
      const premiumUsers = users.filter(u => u.is_premium).length;
      const adminUsers = users.filter(u => u.is_admin).length;

      const companyBreakdown = users.reduce((acc: any, user) => {
        const company = user.company || 'unknown';
        acc[company] = (acc[company] || 0) + 1;
        return acc;
      }, {});

      return {
        totalUsers,
        premiumUsers,
        adminUsers,
        companyBreakdown,
        users
      };
    },
  });

  const { data: shiftStats } = useQuery({
    queryKey: ['analytics-shifts', timeRange],
    queryFn: async () => {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: shifts, error } = await supabase
        .from('shifts')
        .select('id, date, type, user_id, created_at')
        .gte('date', startDate.toISOString().split('T')[0]);

      if (error) throw error;

      const totalShifts = shifts.length;
      const uniqueUsers = new Set(shifts.map(s => s.user_id)).size;

      const shiftTypes = shifts.reduce((acc: any, shift) => {
        acc[shift.type] = (acc[shift.type] || 0) + 1;
        return acc;
      }, {});

      const dailyShifts = shifts.reduce((acc: any, shift) => {
        const date = shift.date;
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return {
        totalShifts,
        uniqueUsers,
        shiftTypes,
        dailyShifts,
        averageShiftsPerUser: uniqueUsers > 0 ? (totalShifts / uniqueUsers).toFixed(1) : 0
      };
    },
  });

  const { data: appUsage } = useQuery({
    queryKey: ['analytics-usage', timeRange],
    queryFn: async () => {
      // Mock data for app usage
      return {
        pageViews: 15420,
        sessionDuration: '12m 34s',
        bounceRate: '23.5%',
        topPages: [
          { page: '/dashboard', views: 5420, percentage: 35.2 },
          { page: '/shifts', views: 3210, percentage: 20.8 },
          { page: '/rideshare', views: 2890, percentage: 18.7 },
          { page: '/profile', views: 1950, percentage: 12.6 },
          { page: '/settings', views: 1950, percentage: 12.7 }
        ],
        deviceBreakdown: {
          mobile: 65,
          desktop: 30,
          tablet: 5
        }
      };
    },
  });

  const formatPercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Přehled využití aplikace a uživatelských statistik
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dní</SelectItem>
              <SelectItem value="30d">30 dní</SelectItem>
              <SelectItem value="90d">90 dní</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Obnovit
          </Button>
          
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="users">Uživatelé</TabsTrigger>
          <TabsTrigger value="activity">Aktivita</TabsTrigger>
          <TabsTrigger value="companies">Firmy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Celkem uživatelů
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats?.totalUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% oproti minulému období
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Aktivní směny
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {shiftStats?.totalShifts || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {shiftStats?.averageShiftsPerUser || 0} průměr na uživatele
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Zobrazení stránek
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appUsage?.pageViews?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Průměrná doba: {appUsage?.sessionDuration || '0m'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Premium uživatelé
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats?.premiumUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(userStats?.premiumUsers || 0, userStats?.totalUsers || 0)}% z celkového počtu
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Nejnavštěvovanější stránky
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appUsage?.topPages?.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{page.page}</p>
                          <p className="text-sm text-muted-foreground">
                            {page.views} zobrazení
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {page.percentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Přístup podle zařízení
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Mobilní zařízení</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${appUsage?.deviceBreakdown?.mobile || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">
                        {appUsage?.deviceBreakdown?.mobile || 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Desktop</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${appUsage?.deviceBreakdown?.desktop || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">
                        {appUsage?.deviceBreakdown?.desktop || 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Tablet</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${appUsage?.deviceBreakdown?.tablet || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">
                        {appUsage?.deviceBreakdown?.tablet || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Registrace uživatelů
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold">
                    {userStats?.totalUsers || 0}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Premium</p>
                      <p className="font-medium">{userStats?.premiumUsers || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Admini</p>
                      <p className="font-medium">{userStats?.adminUsers || 0}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Rozdělení podle firem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(userStats?.companyBreakdown || {}).map(([company, count]) => (
                    <div key={company} className="flex items-center justify-between">
                      <span className="capitalize">{company === 'unknown' ? 'Nespecifikováno' : company}</span>
                      <Badge variant="outline">
                        {count as number} ({formatPercentage(count as number, userStats?.totalUsers || 0)}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Statistiky směn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold">
                    {shiftStats?.totalShifts || 0}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Unikátní uživatelé</span>
                      <span className="font-medium">{shiftStats?.uniqueUsers || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Průměr na uživatele</span>
                      <span className="font-medium">{shiftStats?.averageShiftsPerUser || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Typy směn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(shiftStats?.shiftTypes || {}).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="capitalize">{type}</span>
                      <Badge variant="outline">
                        {count as number} ({formatPercentage(count as number, shiftStats?.totalShifts || 0)}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Přehled aktivit podle firem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analýza podle firem bude brzy dostupná</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};