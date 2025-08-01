import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './auth';
import { toast } from 'sonner';

export type AdminPermissionLevel = 'viewer' | 'moderator' | 'admin' | 'super_admin';

export interface AdminPermission {
  id: string;
  user_id: string;
  permission_level: AdminPermissionLevel;
  granted_by: string | null;
  granted_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemConfig {
  id: string;
  config_key: string;
  config_value: any;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyMenuItems {
  id: string;
  company: 'dhl' | 'adecco' | 'randstad';
  menu_key: string;
  title_cs: string;
  title_de: string | null;
  title_pl: string | null;
  description_cs: string | null;
  description_de: string | null;
  description_pl: string | null;
  icon: string;
  route: string;
  is_enabled: boolean;
  display_order: number;
  required_permission: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  target_table: string | null;
  target_id: string | null;
  old_values: any;
  new_values: any;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const useAdminV2 = () => {
  const { unifiedUser } = useAuth();
  const queryClient = useQueryClient();

  // Check if user has admin permissions
  const { data: adminPermissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['admin-permissions', unifiedUser?.id],
    queryFn: async () => {
      if (!unifiedUser?.id) return null;
      
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('user_id', unifiedUser.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as AdminPermission | null;
    },
    enabled: !!unifiedUser?.id,
  });

  // Get all admin permissions (for super admins)
  const { data: allAdminPermissions } = useQuery({
    queryKey: ['all-admin-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select(`
          *,
          profiles!admin_permissions_user_id_fkey(email, username)
        `)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: adminPermissions?.permission_level === 'super_admin',
  });

  // Get system configuration
  const { data: systemConfig } = useQuery({
    queryKey: ['system-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_config')
        .select('*')
        .order('config_key');

      if (error) throw error;
      return data as SystemConfig[];
    },
    enabled: !!adminPermissions,
  });

  // Get company menu items
  const { data: companyMenuItems } = useQuery({
    queryKey: ['company-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_menu_items')
        .select('*')
        .order('company, display_order');

      if (error) throw error;
      return data as CompanyMenuItems[];
    },
    enabled: !!adminPermissions,
  });

  // Get audit logs
  const { data: auditLogs } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select(`
          *,
          profiles!admin_audit_log_admin_user_id_fkey(email, username)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    enabled: adminPermissions?.permission_level === 'super_admin',
  });

  // Grant admin permission mutation
  const grantPermissionMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      permissionLevel, 
      expiresAt 
    }: { 
      userId: string; 
      permissionLevel: AdminPermissionLevel; 
      expiresAt?: string;
    }) => {
      const { data, error } = await supabase
        .from('admin_permissions')
        .insert({
          user_id: userId,
          permission_level: permissionLevel,
          granted_by: unifiedUser?.id,
          expires_at: expiresAt || null,
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-admin-permissions'] });
      toast.success('Oprávnění bylo uděleno');
    },
    onError: (error) => {
      console.error('Error granting permission:', error);
      toast.error('Nepodařilo se udělit oprávnění');
    },
  });

  // Revoke admin permission mutation
  const revokePermissionMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      const { error } = await supabase
        .from('admin_permissions')
        .update({ is_active: false })
        .eq('id', permissionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-admin-permissions'] });
      toast.success('Oprávnění bylo odebráno');
    },
    onError: (error) => {
      console.error('Error revoking permission:', error);
      toast.error('Nepodařilo se odebrat oprávnění');
    },
  });

  // Update system config mutation
  const updateSystemConfigMutation = useMutation({
    mutationFn: async ({ 
      configKey, 
      configValue, 
      description 
    }: { 
      configKey: string; 
      configValue: any; 
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('system_config')
        .upsert({
          config_key: configKey,
          config_value: configValue,
          description: description || null,
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-config'] });
      toast.success('Konfigurace byla aktualizována');
    },
    onError: (error) => {
      console.error('Error updating config:', error);
      toast.error('Nepodařilo se aktualizovat konfiguraci');
    },
  });

  // Toggle company menu item mutation
  const toggleCompanyMenuItemMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('company_menu_items')
        .update({ is_enabled: isEnabled })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-menu-items'] });
      toast.success('Položka menu byla aktualizována');
    },
    onError: (error) => {
      console.error('Error updating menu item:', error);
      toast.error('Nepodařilo se aktualizovat položku menu');
    },
  });

  // Helper functions
  const hasPermission = (requiredLevel: AdminPermissionLevel): boolean => {
    if (!adminPermissions?.is_active) return false;
    
    const levels = ['viewer', 'moderator', 'admin', 'super_admin'];
    const userLevel = levels.indexOf(adminPermissions.permission_level);
    const requiredLevelIndex = levels.indexOf(requiredLevel);
    
    return userLevel >= requiredLevelIndex;
  };

  const isAdmin = (): boolean => hasPermission('admin');
  const isSuperAdmin = (): boolean => hasPermission('super_admin');

  return {
    // Data
    adminPermissions,
    allAdminPermissions,
    systemConfig,
    companyMenuItems,
    auditLogs,
    
    // Loading states
    isLoadingPermissions,
    
    // Mutations
    grantPermission: grantPermissionMutation.mutate,
    revokePermission: revokePermissionMutation.mutate,
    updateSystemConfig: updateSystemConfigMutation.mutate,
    toggleCompanyMenuItem: toggleCompanyMenuItemMutation.mutate,
    
    // Mutation states
    isGrantingPermission: grantPermissionMutation.isPending,
    isRevokingPermission: revokePermissionMutation.isPending,
    isUpdatingConfig: updateSystemConfigMutation.isPending,
    isTogglingMenuItem: toggleCompanyMenuItemMutation.isPending,
    
    // Helper functions
    hasPermission,
    isAdmin,
    isSuperAdmin,
  };
};