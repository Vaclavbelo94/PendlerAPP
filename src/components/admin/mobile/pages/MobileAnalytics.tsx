import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const MobileAnalytics: React.FC = () => {
  const { hasPermission } = useAdminV2();

  const { data: analyticsData, isLoading, refetch } = useQuery({
    queryKey: ['mobile-admin-analytics'],
    queryFn: async () => {
      const [userGrowth, companyStats, activityStats] = await Promise.all([
        // User growth over time
        supabase
          .from('profiles')
          .select('created_at, company')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Company distribution
        supabase
          .from('profiles')
          .select('company, is_premium'),
        
        // Activity stats
        supabase
          .from('security_audit_log')
          .select('event_type, created_at')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        userGrowth: userGrowth.data || [],
        companyStats: companyStats.data || [],
        activityStats: activityStats.data || []
      };
    },
    enabled: hasPermission('viewer')
  });

  const generateChartData = () => {
    if (!analyticsData) return null;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyGrowth = last7Days.map(date => {
      const count = analyticsData.userGrowth.filter(
        user => user.created_at.startsWith(date)
      ).length;
      return { date, count };
    });

    return dailyGrowth;
  };

  if (!hasPermission('viewer')) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Nemáte oprávnění k zobrazení analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Celkem uživatelů</p>
                <p className="text-2xl font-bold">
                  {analyticsData?.companyStats.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nových (7 dní)</p>
                <p className="text-2xl font-bold">
                  {analyticsData?.userGrowth.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Růst uživatelů (7 dní)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="h-40 flex items-end justify-between gap-2">
              {generateChartData()?.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary/20 rounded-t-md min-h-[4px]"
                    style={{ 
                      height: `${Math.max(4, (day.count / Math.max(...generateChartData()?.map(d => d.count) || [1])) * 120)}px` 
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              )) || null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Distribuce podle firem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {['dhl', 'adecco', 'randstad', null].map(company => {
            const count = analyticsData?.companyStats.filter(u => u.company === company).length || 0;
            const total = analyticsData?.companyStats.length || 1;
            const percentage = (count / total) * 100;
            
            return (
              <div key={company || 'other'} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{company || 'Ostatní'}</span>
                  <span>{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      company === 'dhl' ? 'bg-yellow-500' :
                      company === 'adecco' ? 'bg-blue-500' :
                      company === 'randstad' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Aktivita systému (7 dní)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-2xl font-bold">
              {analyticsData?.activityStats.length || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              Celkem bezpečnostních událostí
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};