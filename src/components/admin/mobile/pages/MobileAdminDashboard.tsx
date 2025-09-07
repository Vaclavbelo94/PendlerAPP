import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useAuth } from '@/hooks/auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const MobileAdminDashboard: React.FC = () => {
  const { unifiedUser } = useAuth();
  const { adminPermissions, hasPermission } = useAdminV2();

  // Stats queries
  const { data: userStats } = useQuery({
    queryKey: ['mobile-admin-user-stats'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('company, is_premium, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const total = profiles?.length || 0;
      const premium = profiles?.filter(p => p.is_premium)?.length || 0;
      const companies = {
        dhl: profiles?.filter(p => p.company === 'dhl')?.length || 0,
        adecco: profiles?.filter(p => p.company === 'adecco')?.length || 0,
        randstad: profiles?.filter(p => p.company === 'randstad')?.length || 0
      };

      return { total, premium, companies };
    },
    enabled: hasPermission('viewer')
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['mobile-admin-recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, created_at, company, is_premium')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: hasPermission('viewer')
  });

  const quickStats = [
    {
      title: 'Celkem uživatelů',
      value: userStats?.total || '0',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Premium uživatelé',
      value: userStats?.premium || '0', 
      change: '+8%',
      changeType: 'positive' as const,
      icon: CreditCard,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'DHL zaměstnanci',
      value: userStats?.companies.dhl || '0',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Building2,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      title: 'Měsíční růst',
      value: '24%',
      change: '+3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const alertsData = [
    {
      id: 1,
      type: 'warning',
      title: 'Vysoká zátěž serveru',
      message: 'CPU využití překročilo 80%',
      time: '2 min'
    },
    {
      id: 2,
      type: 'info',
      title: 'Nový premium kód',
      message: '5 nových registrací s DHL kódem',
      time: '15 min'
    },
    {
      id: 3,
      type: 'success',
      title: 'Backup dokončen',
      message: 'Denní backup databáze byl úspěšný',
      time: '1 hod'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Dobré ráno';
    if (hour < 18) return 'Dobrý den';
    return 'Dobrý večer';
  };

  const getPermissionDisplay = () => {
    if (!adminPermissions?.permission_level) return 'Legacy Admin';
    
    const labels = {
      super_admin: 'Super Admin',
      admin: 'Administrator',
      dhl_admin: 'DHL Administrator', 
      moderator: 'Moderátor',
      viewer: 'Prohlížeč'
    };

    return labels[adminPermissions.permission_level];
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, Admin! 👋
        </h1>
        <p className="text-muted-foreground">
          Přihlášen jako {getPermissionDisplay()}
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground truncate">{stat.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">{stat.change}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Rychlé akce</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {hasPermission('admin') && (
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Přidat nového administrátora
            </Button>
          )}
          {hasPermission('admin') && (
            <Button variant="outline" size="sm" className="w-full justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Vytvořit premium kód
            </Button>
          )}
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Building2 className="h-4 w-4 mr-2" />
            Zobrazit firemní statistiky
          </Button>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Systémové upozornění
            <Badge variant="outline" className="text-xs">
              {alertsData.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alertsData.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="mt-0.5">
                {alert.type === 'warning' && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                {alert.type === 'info' && (
                  <Clock className="h-4 w-4 text-blue-500" />
                )}
                {alert.type === 'success' && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.time} před</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentActivity && recentActivity.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Poslední aktivita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.company?.toUpperCase()} • {user.is_premium ? 'Premium' : 'Free'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};