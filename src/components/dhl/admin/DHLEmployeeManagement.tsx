import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Edit, Trash2, Search, Filter, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

interface Employee {
  id: string;
  email: string;
  is_dhl_employee: boolean;
  is_premium: boolean;
  created_at: string;
  personal_number?: string;
  position?: string;
  phone_number?: string;
}

const DHLEmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user } = useAuth();

  const [newEmployee, setNewEmployee] = useState({
    email: '',
    personal_number: '',
    position: '',
    phone_number: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          is_dhl_employee,
          is_premium,
          created_at,
          user_work_data(
            phone_number
          )
        `)
        .eq('is_dhl_employee', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Chyba při načítání zaměstnanců');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    try {
      // First, check if user already exists
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id, email, is_dhl_employee')
        .eq('email', newEmployee.email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (existingUser) {
        // Update existing user to be DHL employee
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            is_dhl_employee: true,
            is_premium: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);

        if (updateError) throw updateError;

        toast.success('Uživatel byl označen jako DHL zaměstnanec');
      } else {
        toast.info('Uživatel s tímto emailem neexistuje. Musí se nejprve zaregistrovat.');
      }

      setNewEmployee({ email: '', personal_number: '', position: '', phone_number: '' });
      setIsAddDialogOpen(false);
      loadEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('Chyba při přidávání zaměstnance');
    }
  };

  const handleToggleEmployee = async (employeeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_dhl_employee: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId);

      if (error) throw error;

      toast.success(currentStatus ? 'Zaměstnanec deaktivován' : 'Zaměstnanec aktivován');
      loadEmployees();
    } catch (error) {
      console.error('Error toggling employee:', error);
      toast.error('Chyba při změně statusu zaměstnance');
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && employee.is_dhl_employee) ||
      (filterStatus === 'inactive' && !employee.is_dhl_employee);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-yellow-600" />
            Správa zaměstnanců
          </CardTitle>
          <CardDescription>
            Přidávání, editace a správa DHL zaměstnanců
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Hledat podle emailu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všichni</SelectItem>
                  <SelectItem value="active">Aktivní</SelectItem>
                  <SelectItem value="inactive">Neaktivní</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Přidat zaměstnance
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Přidat DHL zaměstnance</DialogTitle>
                  <DialogDescription>
                    Zadejte email existujícího uživatele, který se má stát DHL zaměstnancem
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      placeholder="zaměstnanec@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="personal_number">Osobní číslo</Label>
                    <Input
                      id="personal_number"
                      value={newEmployee.personal_number}
                      onChange={(e) => setNewEmployee({...newEmployee, personal_number: e.target.value})}
                      placeholder="123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Pozice</Label>
                    <Input
                      id="position"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                      placeholder="Pozice zaměstnance"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Zrušit
                  </Button>
                  <Button onClick={handleAddEmployee} className="bg-yellow-600 hover:bg-yellow-700">
                    Přidat zaměstnance
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Employee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktivní zaměstnanci</p>
                <p className="text-2xl font-bold text-green-600">
                  {employees.filter(e => e.is_dhl_employee).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Neaktivní zaměstnanci</p>
                <p className="text-2xl font-bold text-red-600">
                  {employees.filter(e => !e.is_dhl_employee).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Celkem zaměstnanců</p>
                <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Seznam zaměstnanců</CardTitle>
          <CardDescription>
            Zobrazeno {filteredEmployees.length} z {employees.length} zaměstnanců
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Registrován</TableHead>
                  <TableHead className="text-right">Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {employee.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.is_dhl_employee ? "default" : "secondary"}>
                        {employee.is_dhl_employee ? "Aktivní" : "Neaktivní"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.is_premium ? "default" : "outline"}>
                        {employee.is_premium ? "Premium" : "Základní"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(employee.created_at).toLocaleDateString('cs-CZ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleEmployee(employee.id, employee.is_dhl_employee)}
                        >
                          {employee.is_dhl_employee ? (
                            <>
                              <UserX className="h-4 w-4 mr-1" />
                              Deaktivovat
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Aktivovat
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredEmployees.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Žádní zaměstnanci nenalezeni</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DHLEmployeeManagement;