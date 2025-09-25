import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  MoreVertical,
  Crown,
  Shield,
  Eye,
  Users,
  Building2,
  CreditCard,
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  username: string;
  company: string;
  is_premium: boolean;
  is_admin: boolean;
  created_at: string;
  admin_permissions?: any;
}

export const MobileUserManagement: React.FC = () => {
  const { hasPermission, grantPermission } = useAdminV2();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedPermission, setSelectedPermission] = useState<string>('viewer');

  // Fetch users with their admin permissions
  const { data: users, isLoading } = useQuery({
    queryKey: ['mobile-admin-users', searchTerm, filterCompany, filterType],
    queryFn: async () => {
      // First get users
      let query = supabase
        .from('profiles')
        .select('id, email, username, company, is_premium, is_admin, created_at');

      // Apply search filter
      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
      }

      // Apply company filter
      if (filterCompany !== 'all') {
        query = query.eq('company', filterCompany as any);
      }

      const { data: profiles, error: profilesError } = await query
        .order('created_at', { ascending: false })
        .limit(50);

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        return [];
      }

      // Get admin permissions separately
      const userIds = profiles.map(p => p.id);
      const { data: permissions, error: permissionsError } = await supabase
        .from('admin_permissions')
        .select('user_id, permission_level, is_active')
        .in('user_id', userIds)
        .eq('is_active', true);

      if (permissionsError) {
        console.warn('Error loading permissions:', permissionsError);
      }

      // Create permissions map
      const permissionsMap = new Map();
      permissions?.forEach(perm => {
        if (!permissionsMap.has(perm.user_id)) {
          permissionsMap.set(perm.user_id, []);
        }
        permissionsMap.get(perm.user_id).push(perm);
      });

      // Combine data
      let combinedData = profiles.map(profile => ({
        ...profile,
        admin_permissions: permissionsMap.get(profile.id) || []
      }));

      // Filter by user type
      if (filterType === 'premium') {
        combinedData = combinedData.filter(u => u.is_premium);
      } else if (filterType === 'admin') {
        combinedData = combinedData.filter(u => 
          u.is_admin || (u.admin_permissions && u.admin_permissions.length > 0)
        );
      }

      return combinedData as User[];
    },
    enabled: hasPermission('moderator')
  });

  const grantPermissionMutation = useMutation({
    mutationFn: async ({ userId, permission }: { userId: string; permission: string }) => {
      const { error } = await supabase
        .from('admin_permissions')
        .insert({
          user_id: userId,
          permission_level: permission as any,
          granted_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-admin-users'] });
      toast.success('Oprávnění bylo uděleno');
      setSelectedUserId('');
    },
    onError: () => {
      toast.error('Nepodařilo se udělit oprávnění');
    }
  });

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getPermissionBadge = (user: User) => {
    if (user.admin_permissions && user.admin_permissions.length > 0) {
      const activePermission = user.admin_permissions.find((p: any) => p.is_active);
      if (activePermission) {
        const config = {
          super_admin: { icon: Crown, label: 'Super', color: 'bg-red-100 text-red-800' },
          admin: { icon: Shield, label: 'Admin', color: 'bg-orange-100 text-orange-800' },
          dhl_admin: { icon: Building2, label: 'DHL', color: 'bg-yellow-100 text-yellow-800' },
          moderator: { icon: Users, label: 'Mod', color: 'bg-blue-100 text-blue-800' },
          viewer: { icon: Eye, label: 'View', color: 'bg-green-100 text-green-800' }
        };

        const { icon: Icon, label, color } = config[activePermission.permission_level as keyof typeof config];
        
        return (
          <Badge className={`${color} text-xs px-2 py-0.5 gap-1`}>
            <Icon className="h-3 w-3" />
            {label}
          </Badge>
        );
      }
    }

    if (user.is_admin) {
      return (
        <Badge className="bg-red-100 text-red-800 text-xs px-2 py-0.5 gap-1">
          <Crown className="h-3 w-3" />
          Legacy
        </Badge>
      );
    }

    return null;
  };

  const getCompanyBadge = (company: string | null) => {
    if (!company) return null;

    const colors = {
      dhl: 'bg-yellow-100 text-yellow-800',
      adecco: 'bg-blue-100 text-blue-800',
      randstad: 'bg-green-100 text-green-800'
    };

    return (
      <Badge variant="outline" className={`text-xs ${colors[company as keyof typeof colors]}`}>
        {company.toUpperCase()}
      </Badge>
    );
  };

  if (!hasPermission('moderator')) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nedostatečná oprávnění</h2>
          <p className="text-muted-foreground">
            Pro správu uživatelů potřebujete oprávnění moderátora nebo vyšší.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Správa uživatelů</h1>
        <p className="text-muted-foreground">
          Spravujte uživatele a jejich oprávnění
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Vyhledat uživatele..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny firmy</SelectItem>
              <SelectItem value="dhl">DHL</SelectItem>
              <SelectItem value="adecco">Adecco</SelectItem>
              <SelectItem value="randstad">Randstad</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všichni</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="admin">Administrátoři</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Načítání uživatelů...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users?.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user.email} />
                      <AvatarFallback className="text-sm font-medium">
                        {getUserInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm truncate">{user.email}</p>
                        {user.is_premium && (
                          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5 gap-1">
                            <CreditCard className="h-3 w-3" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {getCompanyBadge(user.company)}
                        {getPermissionBadge(user)}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        Registrován: {new Date(user.created_at).toLocaleDateString('cs-CZ')}
                      </p>
                    </div>
                  </div>

                  {hasPermission('admin') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault();
                              setSelectedUserId(user.id);
                            }}>
                              <Shield className="h-4 w-4 mr-2" />
                              Udělit oprávnění
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Udělit oprávnění</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Uživatel</Label>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                              
                              <div>
                                <Label htmlFor="permission">Úroveň oprávnění</Label>
                                <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="viewer">Prohlížeč</SelectItem>
                                    <SelectItem value="moderator">Moderátor</SelectItem>
                                    {hasPermission('super_admin') && (
                                      <>
                                        <SelectItem value="admin">Administrator</SelectItem>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <Button 
                                onClick={() => grantPermissionMutation.mutate({
                                  userId: selectedUserId,
                                  permission: selectedPermission
                                })}
                                disabled={grantPermissionMutation.isPending}
                                className="w-full"
                              >
                                Udělit oprávnění
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Poslat email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {users && users.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Žádní uživatelé nenalezeni
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};