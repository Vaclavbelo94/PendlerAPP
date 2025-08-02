import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CompanyModule, CompanyWidget } from './useCompanyModules';
import { CompanyType } from '@/types/auth';

// Extended types for admin use
export interface CompanyModuleAdmin extends CompanyModule {
  // Additional admin-specific fields if needed
}

export interface CompanyWidgetAdmin extends CompanyWidget {
  // Additional admin-specific fields if needed
}

export const useCompanyModulesAdmin = () => {
  const queryClient = useQueryClient();

  // Fetch all company modules for admin
  const { data: allModules = [], isLoading: isLoadingModules } = useQuery({
    queryKey: ['company-modules-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_modules')
        .select('*')
        .order('company, display_order');

      if (error) throw error;
      return data as CompanyModuleAdmin[];
    },
  });

  // Fetch all company widgets for admin
  const { data: allWidgets = [], isLoading: isLoadingWidgets } = useQuery({
    queryKey: ['company-widgets-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_widgets')
        .select('*')
        .order('company, display_order');

      if (error) throw error;
      return data as CompanyWidgetAdmin[];
    },
  });

  const isLoading = isLoadingModules || isLoadingWidgets;

  // Toggle module enabled/disabled
  const toggleModuleMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('company_modules')
        .update({ is_enabled: isEnabled })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-modules-admin'] });
      queryClient.invalidateQueries({ queryKey: ['company-modules'] });
      toast.success('Modul byl aktualizován');
    },
    onError: (error) => {
      console.error('Error toggling module:', error);
      toast.error('Nepodařilo se aktualizovat modul');
    },
  });

  // Toggle widget enabled/disabled
  const toggleWidgetMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('company_widgets')
        .update({ is_enabled: isEnabled })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-widgets-admin'] });
      queryClient.invalidateQueries({ queryKey: ['company-widgets'] });
      toast.success('Widget byl aktualizován');
    },
    onError: (error) => {
      console.error('Error toggling widget:', error);
      toast.error('Nepodařilo se aktualizovat widget');
    },
  });

  // Update module config
  const updateModuleConfigMutation = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: any }) => {
      const { error } = await supabase
        .from('company_modules')
        .update({ config })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-modules-admin'] });
      queryClient.invalidateQueries({ queryKey: ['company-modules'] });
      toast.success('Konfigurace modulu byla aktualizována');
    },
    onError: (error) => {
      console.error('Error updating module config:', error);
      toast.error('Nepodařilo se aktualizovat konfiguraci modulu');
    },
  });

  // Update widget config
  const updateWidgetConfigMutation = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: any }) => {
      const { error } = await supabase
        .from('company_widgets')
        .update({ config })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-widgets-admin'] });
      queryClient.invalidateQueries({ queryKey: ['company-widgets'] });
      toast.success('Konfigurace widgetu byla aktualizována');
    },
    onError: (error) => {
      console.error('Error updating widget config:', error);
      toast.error('Nepodařilo se aktualizovat konfiguraci widgetu');
    },
  });

  // Bulk toggle modules for a company
  const bulkToggleModulesMutation = useMutation({
    mutationFn: async ({ company, isEnabled }: { company: CompanyType; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('company_modules')
        .update({ is_enabled: isEnabled })
        .eq('company', company);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-modules-admin'] });
      queryClient.invalidateQueries({ queryKey: ['company-modules'] });
      toast.success('Všechny moduly byly aktualizovány');
    },
    onError: (error) => {
      console.error('Error bulk toggling modules:', error);
      toast.error('Nepodařilo se aktualizovat moduly');
    },
  });

  // Bulk toggle widgets for a company
  const bulkToggleWidgetsMutation = useMutation({
    mutationFn: async ({ company, isEnabled }: { company: CompanyType; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('company_widgets')
        .update({ is_enabled: isEnabled })
        .eq('company', company);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-widgets-admin'] });
      queryClient.invalidateQueries({ queryKey: ['company-widgets'] });
      toast.success('Všechny widgety byly aktualizovány');
    },
    onError: (error) => {
      console.error('Error bulk toggling widgets:', error);
      toast.error('Nepodařilo se aktualizovat widgety');
    },
  });

  return {
    // Data
    allModules,
    allWidgets,
    isLoading,
    
    // Mutations
    toggleModule: toggleModuleMutation.mutate,
    toggleWidget: toggleWidgetMutation.mutate,
    updateModuleConfig: updateModuleConfigMutation.mutate,
    updateWidgetConfig: updateWidgetConfigMutation.mutate,
    bulkToggleModules: bulkToggleModulesMutation.mutate,
    bulkToggleWidgets: bulkToggleWidgetsMutation.mutate,
    
    // Loading states
    isTogglingModule: toggleModuleMutation.isPending,
    isTogglingWidget: toggleWidgetMutation.isPending,
    isUpdatingModuleConfig: updateModuleConfigMutation.isPending,
    isUpdatingWidgetConfig: updateWidgetConfigMutation.isPending,
    isBulkTogglingModules: bulkToggleModulesMutation.isPending,
    isBulkTogglingWidgets: bulkToggleWidgetsMutation.isPending,
  };
};