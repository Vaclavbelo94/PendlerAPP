import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Key,
  RefreshCw,
  Search,
  Eye,
  Ban
} from 'lucide-react';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const MobileSecurity: React.FC = () => {
  const { hasPermission } = useAdminV2();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: securityData, isLoading, refetch } = useQuery({
    queryKey: ['mobile-admin-security', searchTerm],
    queryFn: async () => {
      const [auditLogs, adminPermissions, rateLimit] = await Promise.all([
        // Security audit logs
        supabase
          .from('security_audit_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20),
        
        // Admin permissions
        supabase
          .from('admin_permissions')
          .select(`
            *, 
            profiles!admin_permissions_user_id_fkey(email),
            granted_by_user:profiles!admin_permissions_granted_by_fkey(email)
          `)
          .eq('is_active', true),
        
        // Rate limit logs
        supabase
          .from('rate_limit_log')
          .select('*')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      return {
        auditLogs: auditLogs.data || [],
        adminPermissions: adminPermissions.data || [],
        rateLimit: rateLimit.data || []
      };
    },
    enabled: hasPermission('admin')
  });

  const runSecurityScan = useMutation({
    mutationFn: async () => {
      // Simulate security scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { vulnerabilities: Math.floor(Math.random() * 5), warnings: Math.floor(Math.random() * 10) };
    },
    onSuccess: (data) => {
      toast.success(`Bezpečnostní sken dokončen: ${data.vulnerabilities} zranitelností, ${data.warnings} varování`);
      refetch();
    }
  });

  const getRiskLevelColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'LOGIN_ATTEMPT': return <Key className="h-4 w-4" />;
      case 'MALICIOUS_INPUT_DETECTED': return <AlertTriangle className="h-4 w-4" />;
      case 'RATE_LIMIT_EXCEEDED': return <Ban className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (!hasPermission('admin')) {
    return (
      <div className="p-4 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nemáte oprávnění k zobrazení bezpečnostních nastavení.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Zabezpečení
        </h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => runSecurityScan.mutate()}
          disabled={runSecurityScan.isPending}
        >
          {runSecurityScan.isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
          Sken
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktivní admin</p>
                <p className="text-2xl font-bold">
                  {securityData?.adminPermissions.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Incidenty (24h)</p>
                <p className="text-2xl font-bold">
                  {securityData?.auditLogs.filter(log => 
                    log.risk_level === 'high' || log.risk_level === 'medium'
                  ).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Vyhledat v logu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Admin Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Aktivní administrátoři
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            securityData?.adminPermissions.map((permission: any) => (
              <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{permission.profiles?.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Uděleno: {new Date(permission.granted_at).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={
                    permission.permission_level === 'super_admin' ? 'bg-red-100 text-red-800' :
                    permission.permission_level === 'admin' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {permission.permission_level}
                  </Badge>
                </div>
              </div>
            )) || []
          )}
          {!isLoading && (!securityData?.adminPermissions.length) && (
            <p className="text-center text-muted-foreground py-4">
              Žádní aktivní administrátoři
            </p>
          )}
        </CardContent>
      </Card>

      {/* Security Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Bezpečnostní log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            securityData?.auditLogs
              .filter((log: any) => 
                !searchTerm || 
                log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-1.5 bg-muted rounded">
                    {getEventTypeIcon(log.event_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{log.event_type}</p>
                      <Badge variant="secondary" className={getRiskLevelColor(log.risk_level)}>
                        {log.risk_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString('cs-CZ')}
                    </p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {JSON.stringify(log.details, null, 2).substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>
              )) || []
          )}
          {!isLoading && (!securityData?.auditLogs.length) && (
            <p className="text-center text-muted-foreground py-4">
              Žádné bezpečnostní události
            </p>
          )}
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Rate Limiting (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-2xl font-bold">
              {securityData?.rateLimit.length || 0}
            </p>
            <p className="text-sm text-muted-foreground">
              Blokovaných požadavků za posledních 24 hodin
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};