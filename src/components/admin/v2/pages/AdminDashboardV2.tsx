import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useAuth } from '@/hooks/auth';
import { 
  Users, 
  Building2, 
  Shield, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export const AdminDashboardV2: React.FC = () => {
  const { unifiedUser } = useAuth();
  const { adminPermissions, allAdminPermissions, systemConfig } = useAdminV2();

  const stats = [
    {
      title: 'Celkem adminů',
      value: allAdminPermissions?.length || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Aktivní firmy',
      value: 3,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Úroveň oprávnění',
      value: adminPermissions?.permission_level || 'viewer',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Systémový stav',
      value: 'Online',
      icon: Activity,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  const recentActivity = [
    {
      action: 'Přihlášení do admin panelu',
      user: unifiedUser?.email,
      time: 'před chvílí',
      status: 'success',
    },
    {
      action: 'Aktualizace systémové konfigurace',
      user: 'system',
      time: 'před 2 hodinami',
      status: 'info',
    },
    {
      action: 'Nový uživatel zaregistrován',
      user: 'system',
      time: 'před 5 hodinami',
      status: 'success',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Přehled administračních funkcí a statistik
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
              </div>
              {stat.title === 'Úroveň oprávnění' && (
                <Badge variant="outline" className="mt-2">
                  {stat.value}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Nedávná aktivita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Systémový přehled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Databáze</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Funkční
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Autentifikace</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Aktivní
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Dostupný
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Rychlé akce</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
            <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Správa uživatelů</span>
              </div>
            </Card>
            <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Správa firem</span>
              </div>
            </Card>
            <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Bezpečnost</span>
              </div>
            </Card>
            <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Monitoring</span>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};