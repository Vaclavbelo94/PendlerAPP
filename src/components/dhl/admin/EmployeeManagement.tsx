import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, UserPlus, Settings, MoreHorizontal, MapPin, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Employee {
  id: string;
  email: string;
  username: string;
  is_dhl_employee: boolean;
  created_at: string;
  last_login?: string;
  shift_count?: number;
  position_name?: string;
  work_group_name?: string;
  performance_score?: number;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, filterStatus]);

  const fetchEmployees = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          username,
          is_dhl_employee,
          created_at,
          user_statistics (
            last_login,
            shift_count
          ),
          user_dhl_assignments (
            dhl_positions (
              name
            ),
            dhl_work_groups (
              name
            )
          )
        `)
        .eq('is_dhl_employee', true);

      if (error) throw error;

      const processedEmployees = profiles?.map(profile => {
        const userStats = Array.isArray(profile.user_statistics) ? profile.user_statistics[0] : profile.user_statistics;
        const assignment = Array.isArray(profile.user_dhl_assignments) ? profile.user_dhl_assignments[0] : profile.user_dhl_assignments;
        
        return {
          id: profile.id,
          email: profile.email || '',
          username: profile.username || '',
          is_dhl_employee: profile.is_dhl_employee || false,
          created_at: profile.created_at,
          last_login: userStats?.last_login,
          shift_count: userStats?.shift_count || 0,
          position_name: assignment?.dhl_positions?.name,
          work_group_name: assignment?.dhl_work_groups?.name,
          performance_score: Math.floor(Math.random() * 100) + 1 // Mock performance score
        };
      }) || [];

      setEmployees(processedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst seznam zaměstnanců",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(emp => {
        switch (filterStatus) {
          case 'active':
            return emp.last_login && new Date(emp.last_login) > thirtyDaysAgo;
          case 'inactive':
            return !emp.last_login || new Date(emp.last_login) <= thirtyDaysAgo;
          case 'no-assignment':
            return !emp.position_name;
          default:
            return true;
        }
      });
    }

    setFilteredEmployees(filtered);
  };

  const getEmployeeStatusBadge = (employee: Employee) => {
    if (!employee.last_login) {
      return <Badge variant="secondary">Nikdy nepřihlášen</Badge>;
    }
    
    const now = new Date();
    const lastLogin = new Date(employee.last_login);
    const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) {
      return <Badge variant="default" className="bg-green-500">Aktivní</Badge>;
    } else if (daysDiff <= 30) {
      return <Badge variant="secondary">Méně aktivní</Badge>;
    } else {
      return <Badge variant="destructive">Neaktivní</Badge>;
    }
  };

  const getPerformanceColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleEmployeeAction = (employee: Employee, action: string) => {
    setSelectedEmployee(employee);
    
    switch (action) {
      case 'view':
        setShowEmployeeDialog(true);
        break;
      case 'deactivate':
        // Implement deactivation logic
        toast({
          title: "Info",
          description: "Funkce deaktivace bude implementována",
        });
        break;
      case 'reassign':
        // Implement reassignment logic
        toast({
          title: "Info",
          description: "Funkce přeřazení bude implementována",
        });
        break;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Správa zaměstnanců DHL
          </CardTitle>
          <CardDescription>
            Spravujte DHL zaměstnance, jejich přiřazení a výkonnost
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hledat podle emailu, jména nebo pozice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrovat podle stavu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všichni zaměstnanci</SelectItem>
                  <SelectItem value="active">Aktivní (7 dní)</SelectItem>
                  <SelectItem value="inactive">Neaktivní (30+ dní)</SelectItem>
                  <SelectItem value="no-assignment">Bez přiřazení</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Přidat zaměstnance
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Celkem</p>
                      <p className="text-2xl font-bold">{employees.length}</p>
                    </div>
                    <Settings className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Aktivní</p>
                      <p className="text-2xl font-bold text-green-600">
                        {employees.filter(emp => {
                          if (!emp.last_login) return false;
                          const daysDiff = Math.floor((new Date().getTime() - new Date(emp.last_login).getTime()) / (1000 * 60 * 60 * 24));
                          return daysDiff <= 7;
                        }).length}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bez přiřazení</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {employees.filter(emp => !emp.position_name).length}
                      </p>
                    </div>
                    <MapPin className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. směny/měsíc</p>
                      <p className="text-2xl font-bold">
                        {Math.round(employees.reduce((sum, emp) => sum + (emp.shift_count || 0), 0) / employees.length || 0)}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Employee List */}
            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium">
                <div className="col-span-3">Zaměstnanec</div>
                <div className="col-span-2">Pozice</div>
                <div className="col-span-2">Stav</div>
                <div className="col-span-2">Výkonnost</div>
                <div className="col-span-2">Poslední přihlášení</div>
                <div className="col-span-1">Akce</div>
              </div>
              
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-muted/20">
                  <div className="col-span-3 flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {employee.username ? employee.username.slice(0, 2).toUpperCase() : employee.email.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.username || employee.email}</p>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <div>
                      <p className="font-medium">{employee.position_name || 'Nepřiřazeno'}</p>
                      <p className="text-sm text-muted-foreground">{employee.work_group_name || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    {getEmployeeStatusBadge(employee)}
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <div>
                      <p className={`font-medium ${getPerformanceColor(employee.performance_score)}`}>
                        {employee.performance_score || 'N/A'}%
                      </p>
                      <p className="text-sm text-muted-foreground">{employee.shift_count || 0} směn</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm">
                      {employee.last_login 
                        ? new Date(employee.last_login).toLocaleDateString('cs-CZ')
                        : 'Nikdy'
                      }
                    </p>
                  </div>
                  
                  <div className="col-span-1 flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEmployeeAction(employee, 'view')}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Detail Dialog */}
      <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail zaměstnance</DialogTitle>
            <DialogDescription>
              Detailní informace o zaměstnanci {selectedEmployee?.username || selectedEmployee?.email}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input value={selectedEmployee.email} readOnly />
                </div>
                <div>
                  <Label>Uživatelské jméno</Label>
                  <Input value={selectedEmployee.username || ''} readOnly />
                </div>
                <div>
                  <Label>Pozice</Label>
                  <Input value={selectedEmployee.position_name || 'Nepřiřazeno'} readOnly />
                </div>
                <div>
                  <Label>Pracovní skupina</Label>
                  <Input value={selectedEmployee.work_group_name || 'Nepřiřazeno'} readOnly />
                </div>
                <div>
                  <Label>Počet směn</Label>
                  <Input value={selectedEmployee.shift_count?.toString() || '0'} readOnly />
                </div>
                <div>
                  <Label>Výkonnost</Label>
                  <Input value={`${selectedEmployee.performance_score || 'N/A'}%`} readOnly />
                </div>
              </div>
              
              <div>
                <Label>Poznámky administrátora</Label>
                <Textarea placeholder="Poznámky k zaměstnanci..." />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmployeeDialog(false)}>
              Zavřít
            </Button>
            <Button>
              Uložit změny
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;