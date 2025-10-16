
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Activity, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  RefreshCw,
  TrendingUp,
  Users,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface UserActivity {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  resource: string;
  details?: any;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

interface ActivitySummary {
  total_actions: number;
  unique_users: number;
  most_active_user: string;
  popular_action: string;
}

const UserActivityPanel: React.FC = () => {
  const { t } = useTranslation('admin-user-activity');
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([]);
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');

  // Mock data for demonstration
  const mockActivities: UserActivity[] = [
    {
      id: '1',
      user_id: 'user-123',
      user_email: 'user1@example.com',
      action: 'login',
      resource: 'auth',
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      user_id: 'user-456',
      user_email: 'user2@example.com',
      action: 'create_shift',
      resource: 'shifts',
      details: { shift_type: 'morning', date: '2024-01-15' },
      ip_address: '192.168.1.2',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: '3',
      user_id: 'user-123',
      user_email: 'user1@example.com',
      action: 'access_premium',
      resource: 'premium',
      details: { feature: 'tax_advisor' },
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      timestamp: new Date(Date.now() - 600000).toISOString()
    },
    {
      id: '4',
      user_id: 'user-789',
      user_email: 'user3@example.com',
      action: 'logout',
      resource: 'auth',
      ip_address: '192.168.1.3',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      timestamp: new Date(Date.now() - 900000).toISOString()
    }
  ];

  const mockSummary: ActivitySummary = {
    total_actions: 156,
    unique_users: 34,
    most_active_user: 'user1@example.com',
    popular_action: 'login'
  };

  useEffect(() => {
    fetchUserActivity();
  }, [timeFilter]);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, actionFilter]);

  const fetchUserActivity = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActivities(mockActivities);
      setSummary(mockSummary);
      toast.success('Aktivita uživatelů načtena');
    } catch (error) {
      console.error('Error fetching user activity:', error);
      toast.error('Nepodařilo se načíst aktivitu uživatelů');
    } finally {
      setIsLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.resource.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(activity => activity.action === actionFilter);
    }

    setFilteredActivities(filtered);
  };

  const exportActivity = () => {
    const csvContent = [
      ['Čas', 'Uživatel', 'Akce', 'Zdroj', 'IP adresa', 'Detaily'].join(','),
      ...filteredActivities.map(activity => [
        activity.timestamp,
        activity.user_email,
        activity.action,
        activity.resource,
        activity.ip_address,
        activity.details ? JSON.stringify(activity.details) : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-activity-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Aktivita exportována');
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'login': return 'default';
      case 'logout': return 'secondary';
      case 'create_shift': return 'default';
      case 'access_premium': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <User className="h-3 w-3" />;
      case 'logout': return <User className="h-3 w-3" />;
      case 'create_shift': return <Calendar className="h-3 w-3" />;
      case 'access_premium': return <TrendingUp className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const uniqueActions = [...new Set(activities.map(a => a.action))];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Celkem akcí
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_actions}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Aktivní uživatelé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.unique_users}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Nejaktivnější
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{summary.most_active_user}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Populární akce
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{summary.popular_action}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Aktivita uživatelů
              </CardTitle>
              <CardDescription>
                Monitoring a audit uživatelských akcí
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchUserActivity} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Obnovit
              </Button>
              <Button variant="outline" onClick={exportActivity}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hledat podle uživatele, akce nebo zdroje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Akce" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny akce</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Poslední hodina</SelectItem>
                <SelectItem value="24h">Posledních 24h</SelectItem>
                <SelectItem value="7d">Posledních 7 dní</SelectItem>
                <SelectItem value="30d">Posledních 30 dní</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity Table */}
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Uživatel</TableHead>
                  <TableHead>Akce</TableHead>
                  <TableHead>Zdroj</TableHead>
                  <TableHead>Čas</TableHead>
                  <TableHead>IP adresa</TableHead>
                  <TableHead>Detaily</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {activity.user_email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{activity.user_email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(activity.action)} className="flex items-center gap-1 w-fit">
                        {getActionIcon(activity.action)}
                        {activity.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.resource}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(activity.timestamp).toLocaleString('cs-CZ')}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {activity.ip_address}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {activity.details ? (
                        <Badge variant="secondary" className="text-xs">
                          {Object.keys(activity.details).length} položek
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityPanel;
