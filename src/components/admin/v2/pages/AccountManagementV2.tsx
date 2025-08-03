import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Shield, 
  Mail,
  Phone,
  Building2,
  Calendar,
  UserX
} from 'lucide-react';
import { toast } from 'sonner';
import { identifyUnwantedAccounts, cleanupUnwantedAccounts, KEEP_ACCOUNTS } from '@/utils/adminCleanupUtils';

export const AccountManagementV2: React.FC = () => {
  const { grantPermission, revokePermission } = useAdminV2();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isCleanupDialogOpen, setIsCleanupDialogOpen] = useState(false);
  const [cleanupData, setCleanupData] = useState<any>(null);
  const [isCleanupLoading, setIsCleanupLoading] = useState(false);

  // Fetch all users with profiles
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch admin permissions separately
  const { data: allAdminPermissions = [] } = useQuery({
    queryKey: ['admin-permissions-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  // Helper function to get user permission - moved before filteredUsers
  const getUserPermission = (user: any) => {
    return allAdminPermissions?.find((p: any) => p.user_id === user.id && p.is_active);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = selectedCompany === 'all' || user.company === selectedCompany;
    
    const userPermission = getUserPermission(user);
    const matchesRole = selectedRole === 'all' || 
      (selectedRole === 'admin' && userPermission) ||
      (selectedRole === 'user' && !userPermission);

    return matchesSearch && matchesCompany && matchesRole;
  });

  const handleGrantPermission = async (userId: string, level: string) => {
    try {
      await grantPermission({
        userId,
        permissionLevel: level as any,
      });
      toast.success('Oprávnění bylo uděleno');
      refetch();
      setIsGrantDialogOpen(false);
    } catch (error) {
      toast.error('Nepodařilo se udělit oprávnění');
    }
  };

  const handleRevokePermission = async (permissionId: string) => {
    try {
      await revokePermission(permissionId);
      toast.success('Oprávnění bylo odebráno');
      refetch();
    } catch (error) {
      toast.error('Nepodařilo se odebrat oprávnění');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      // Nejdříve odebereme všechna admin oprávnění
      const { data: userPermissions } = await supabase
        .from('admin_permissions')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (userPermissions && userPermissions.length > 0) {
        for (const permission of userPermissions) {
          await revokePermission(permission.id);
        }
      }

      // Pak smažeme profil uživatele
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Účet ${userEmail} byl smazán`);
      refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Nepodařilo se smazat účet');
    }
  };

  const handleIdentifyUnwantedAccounts = async () => {
    try {
      setIsCleanupLoading(true);
      const data = await identifyUnwantedAccounts();
      setCleanupData(data);
      setIsCleanupDialogOpen(true);
    } catch (error) {
      console.error('Error identifying unwanted accounts:', error);
      toast.error('Nepodařilo se identifikovat nežádoucí účty');
    } finally {
      setIsCleanupLoading(false);
    }
  };

  const handleCleanupConfirm = async () => {
    if (!cleanupData?.unwantedAccounts) return;

    try {
      setIsCleanupLoading(true);
      
      const userIds = cleanupData.unwantedAccounts.map((account: any) => account.id);
      const result = await cleanupUnwantedAccounts(userIds);
      
      toast.success(`Vyčištění dokončeno: ${result.successCount} účtů smazáno, ${result.failureCount} chyb`);
      
      if (result.failureCount > 0) {
        console.warn('Some accounts failed to delete:', result.results.filter((r: any) => !r.success));
      }
      
      setIsCleanupDialogOpen(false);
      setCleanupData(null);
      refetch();
    } catch (error) {
      console.error('Error during cleanup:', error);
      toast.error('Nepodařilo se vyčistit všechny účty');
    } finally {
      setIsCleanupLoading(false);
    }
  };

  const getPermissionBadge = (permission: any) => {
    if (!permission) return <Badge variant="outline">Uživatel</Badge>;
    
    switch (permission.permission_level) {
      case 'super_admin':
        return <Badge variant="destructive" className="text-xs">Super Admin</Badge>;
      case 'admin':
        return <Badge variant="secondary" className="text-xs">Admin</Badge>;
      case 'dhl_admin':
        return (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
              DHL Admin
            </Badge>
            <Badge variant="outline" className="text-xs">DHL</Badge>
          </div>
        );
      case 'moderator':
        return <Badge variant="outline" className="text-xs">Moderator</Badge>;
      case 'viewer':
        return <Badge variant="default" className="text-xs">Viewer</Badge>;
      default:
        return <Badge variant="outline">Uživatel</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Načítám uživatele...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Správa účtů</h1>
          <p className="text-muted-foreground">
            Spravujte uživatelské účty a oprávnění
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleIdentifyUnwantedAccounts}
            disabled={isCleanupLoading}
          >
            <UserX className="mr-2 h-4 w-4" />
            {isCleanupLoading ? 'Analyzuji...' : 'Vyčistit nežádoucí účty'}
          </Button>
          
          <Dialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Udělit oprávnění
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Udělit admin oprávnění</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-select">Vyberte uživatele</Label>
                <Select onValueChange={(value) => setSelectedUser(users.find(u => u.id === value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte uživatele" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter(user => !getUserPermission(user))
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email} ({user.username})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedUser && (
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleGrantPermission(selectedUser.id, 'viewer')}
                  >
                    Viewer
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleGrantPermission(selectedUser.id, 'moderator')}
                  >
                    Moderator
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleGrantPermission(selectedUser.id, 'admin')}
                  >
                    Admin
                  </Button>
                  {selectedUser.company === 'dhl' && (
                    <Button 
                      variant="outline" 
                      className="bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100"
                      onClick={() => handleGrantPermission(selectedUser.id, 'dhl_admin')}
                    >
                      DHL Admin
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    onClick={() => handleGrantPermission(selectedUser.id, 'super_admin')}
                  >
                    Super Admin
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Cleanup Dialog */}
        <AlertDialog open={isCleanupDialogOpen} onOpenChange={setIsCleanupDialogOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Vyčistit nežádoucí účty</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4">
                  <p>
                    Nalezeny následující účty k odstranění. Zachovány budou pouze požadované admin účty:
                  </p>
                  
                  {cleanupData && (
                    <div className="space-y-4">
                      {/* Keep accounts */}
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">✓ Zachované účty ({cleanupData.keepAccounts.length}):</h4>
                        <div className="bg-green-50 p-3 rounded-md space-y-1">
                          {cleanupData.keepAccounts.map((account: any) => (
                            <div key={account.id} className="text-sm text-green-800">
                              • {account.email} ({account.username || 'Bez jména'})
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Unwanted accounts */}
                      <div>
                        <h4 className="font-medium text-red-700 mb-2">✗ Účty k odstranění ({cleanupData.unwantedAccounts.length}):</h4>
                        <div className="bg-red-50 p-3 rounded-md max-h-40 overflow-y-auto space-y-1">
                          {cleanupData.unwantedAccounts.map((account: any) => (
                            <div key={account.id} className="text-sm text-red-800">
                              • {account.email} ({account.username || 'Bez jména'}) - {new Date(account.created_at).toLocaleDateString('cs-CZ')}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-yellow-50 p-3 rounded-md">
                    <p className="text-yellow-800 text-sm font-medium">
                      ⚠️ Tato akce je nevratná a odstraní uživatele jak z auth.users, tak z profiles tabulky!
                    </p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCleanupLoading}>
                Zrušit
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCleanupConfirm}
                disabled={isCleanupLoading || !cleanupData?.unwantedAccounts?.length}
                className="bg-red-600 hover:bg-red-700"
              >
                {isCleanupLoading ? 'Mažu...' : `Smazat ${cleanupData?.unwantedAccounts?.length || 0} účtů`}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hledat uživatele..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Všechny firmy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny firmy</SelectItem>
                <SelectItem value="dhl">DHL</SelectItem>
                <SelectItem value="adecco">Adecco</SelectItem>
                <SelectItem value="randstad">Randstad</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Všechny role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny role</SelectItem>
                <SelectItem value="admin">Admini</SelectItem>
                <SelectItem value="user">Uživatelé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Uživatelé ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => {
              const permission = getUserPermission(user);
              
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{user.username || 'Bez jména'}</h4>
                        {getPermissionBadge(permission)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        
                        {user.company && (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {user.company}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.created_at).toLocaleDateString('cs-CZ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {user.is_premium && (
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                        Premium
                      </Badge>
                    )}
                    
                    {permission ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokePermission(permission.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsGrantDialogOpen(true);
                        }}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Delete User Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Smazat uživatelský účet</AlertDialogTitle>
                          <AlertDialogDescription>
                            Opravdu chcete smazat účet uživatele <strong>{user.email}</strong>?
                            <br />
                            <br />
                            Tato akce je nevratná a odstraní:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Profil uživatele</li>
                              <li>Všechna administrační oprávnění</li>
                              <li>Veškerá související data</li>
                            </ul>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Zrušit</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Smazat účet
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Žádní uživatelé nenalezeni</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};