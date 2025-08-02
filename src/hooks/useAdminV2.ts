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
  const { unifiedUser, isAdmin: legacyIsAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Check if user has admin permissions - TEMPORARILY DISABLED due to RLS recursion
  const { data: adminPermissions, isLoading: isLoadingPermissions, error: permissionError } = useQuery({
    queryKey: ['admin-permissions', unifiedUser?.id],
    queryFn: async () => {
      // TEMPORARY: Skip loading admin_permissions due to RLS recursion issue
      console.log('AdminV2: Skipping admin_permissions query due to RLS recursion - using legacy admin check');
      return null;
    },
    enabled: false, // Disable this query completely for now
    retry: false,
    refetchOnWindowFocus: false
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
    enabled: false, // TEMPORARILY DISABLED due to RLS recursion
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
    enabled: legacyIsAdmin, // Only use legacy admin for now
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
    enabled: legacyIsAdmin, // Only use legacy admin for now
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
    enabled: false, // TEMPORARILY DISABLED due to RLS recursion
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

  // Helper functions - TEMPORARILY using only legacy admin system
  const hasPermission = (requiredLevel: AdminPermissionLevel): boolean => {
    // TEMPORARY: Only use legacy admin system due to RLS recursion
    console.log('AdminV2: Using legacy admin fallback, isAdmin:', legacyIsAdmin);
    return legacyIsAdmin;
  };

  const isAdmin = (): boolean => legacyIsAdmin;
  const isSuperAdmin = (): boolean => legacyIsAdmin;

  return {
    // Data
    adminPermissions,
    allAdminPermissions,
    systemConfig,
    companyMenuItems,
    auditLogs,
    
    // Loading states - if there's an error and user is legacy admin, don't show loading
    isLoadingPermissions: isLoadingPermissions && !permissionError,
    
    // Error state
    permissionError,
    
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