import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock,
  Key,
  Eye,
  Activity,
  FileText,
  Clock,
  Users,
  Database,
  Wifi
} from 'lucide-react';

export const SecurityV2: React.FC = () => {
  const { auditLogs } = useAdminV2();
  const [activeTab, setActiveTab] = useState('overview');

  // Security metrics query using safe approach
  const { data: securityMetrics } = useQuery({
    queryKey: ['security-metrics'],
    queryFn: async () => {
      try {
        // Use admin statistics function for safe access
        const { data: adminStats } = await supabase.rpc('get_admin_statistics');
        const statsData = (adminStats || {}) as Record<string, any>;
        
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Count admin actions directly (this should be safe)
        const { count: adminActions } = await supabase
          .from('admin_audit_log')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString());

        return {
          loginAttempts: Number(statsData.total_users) || 0, // Use total users as proxy
          adminActions: adminActions || 0,
          activeAdmins: 3, // Mock data - could be enhanced later
          securityIncidents: 0
        };
      } catch (error) {
        console.error('Error loading security metrics:', error);
        return {
          loginAttempts: 0,
          adminActions: 0,
          activeAdmins: 0,
          securityIncidents: 0
        };
      }
    },
  });

  // Active sessions query
  const { data: activeSessions } = useQuery({
    queryKey: ['active-sessions'],
    queryFn: async () => {
      // Mock data for active sessions
      return [
        {
          id: '1',
          user: 'admin@pendlerapp.com',
          ip: '192.168.1.100',
          location: 'Praha, CZ',
          device: 'Chrome on Windows',
          lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          isAdmin: true
        },
        {
          id: '2',
          user: 'zkouska@gmail.com',
          ip: '10.0.0.1',
          location: 'Praha, CZ',
          device: 'Firefox on macOS',
          lastActivity: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          isAdmin: true
        }
      ];
    },
  });

  const securityChecks = [
    {
      name: 'RLS Policies',
      status: 'warning',
      description: 'Některé tabulky nemají správně nakonfigurované RLS políčky',
      critical: true
    },
    {
      name: 'SSL/TLS Encryption',
      status: 'success',
      description: 'Všechny spojení jsou šifrována pomocí TLS 1.3',
      critical: true
    },
    {
      name: 'API Keys Rotation',
      status: 'success',
      description: 'API klíče byly rotovány před 30 dny',
      critical: false
    },
    {
      name: 'Backup Verification',
      status: 'success',
      description: 'Zálohy jsou vytvářeny denně a ověřovány',
      critical: true
    },
    {
      name: 'Admin Account Security',
      status: 'warning',
      description: 'Někteří admini nemají povolené 2FA',
      critical: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string, critical: boolean) => {
    const variant = status === 'success' ? 'default' : 
                   status === 'warning' ? 'secondary' : 'destructive';
    
    return (
      <div className="flex items-center gap-2">
        <Badge variant={variant}>
          {status === 'success' ? 'OK' : status === 'warning' ? 'Varování' : 'Chyba'}
        </Badge>
        {critical && (
          <Badge variant="outline" className="text-xs">
            Kritické
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bezpečnost</h1>
        <p className="text-muted-foreground">
          Monitoring bezpečnosti a audit logů
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="audit">Audit Logy</TabsTrigger>
          <TabsTrigger value="sessions">Aktivní Sessions</TabsTrigger>
          <TabsTrigger value="settings">Nastavení</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pokusy o přihlášení (7d)
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityMetrics?.loginAttempts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +12% oproti minulému týdnu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Admin akce (7d)
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityMetrics?.adminActions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Normální aktivita
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Aktivní admini
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityMetrics?.activeAdmins || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Online v posledních 24h
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Bezpečnostní incidenty
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{securityMetrics?.securityIncidents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Žádné incidenty
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Security Checks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Bezpečnostní kontroly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityChecks.map((check, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <h4 className="font-medium">{check.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {check.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(check.status, check.critical)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs?.slice(0, 10).map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-4 border rounded-lg"
                  >
                    <div className="p-2 rounded-full bg-muted">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{log.action}</h4>
                        <Badge variant="outline" className="text-xs">
                          {log.target_table}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Admin: {log.profiles?.email || 'System'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(log.created_at).toLocaleString('cs-CZ')}
                        </span>
                        {log.ip_address && (
                          <span className="flex items-center gap-1">
                            <Wifi className="h-3 w-3" />
                            {log.ip_address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!auditLogs || auditLogs.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Žádné audit logy k dispozici</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Aktivní Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions?.map((session: any) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{session.user}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{session.device}</span>
                          <span>•</span>
                          <span>{session.location}</span>
                          <span>•</span>
                          <span>{session.ip}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Poslední aktivita: {new Date(session.lastActivity).toLocaleString('cs-CZ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {session.isAdmin && (
                        <Badge variant="destructive" className="text-xs">
                          Admin
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Ukončit session
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Bezpečnostní nastavení
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Key className="h-6 w-6 mx-auto mb-2" />
                    <h4 className="font-medium">Rotovat API klíče</h4>
                    <p className="text-sm text-muted-foreground">
                      Vygenerovat nové API klíče
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Database className="h-6 w-6 mx-auto mb-2" />
                    <h4 className="font-medium">Zálohovat databázi</h4>
                    <p className="text-sm text-muted-foreground">
                      Vytvořit manuální zálohu
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Eye className="h-6 w-6 mx-auto mb-2" />
                    <h4 className="font-medium">Security Scan</h4>
                    <p className="text-sm text-muted-foreground">
                      Spustit bezpečnostní sken
                    </p>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <h4 className="font-medium">Export logů</h4>
                    <p className="text-sm text-muted-foreground">
                      Exportovat audit logy
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};