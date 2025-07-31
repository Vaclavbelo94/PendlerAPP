import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CompanyType } from '@/types/auth';
import { CompanyModule, CompanyWidget } from './useCompanyModules';
import { toast } from 'sonner';

export interface CompanyModuleAdmin extends CompanyModule {
  // Additional admin fields if needed
}

export interface CompanyWidgetAdmin extends CompanyWidget {
  // Additional admin fields if needed
}

export const useCompanyModulesAdmin = () => {
  const queryClient = useQueryClient();

  // Fetch all modules for admin view
  const { data: allModules = [], isLoading: isLoadingModules } = useQuery({
    queryKey: ['admin-company-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_modules')
        .select('*')
        .order('company, display_order');

      if (error) throw error;
      return data as CompanyModuleAdmin[];
    },
  });

  // Fetch all widgets for admin view
  const { data: allWidgets = [], isLoading: isLoadingWidgets } = useQuery({
    queryKey: ['admin-company-widgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_widgets')
        .select('*')
        .order('company, category, display_order');

      if (error) throw error;
      return data as CompanyWidgetAdmin[];
    },
  });

  // Toggle module enabled/disabled
  const toggleModuleMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('company_modules')
        .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-company-modules'] });
      queryClient.invalidateQueries({ queryKey: ['company-modules'] });
      toast.success('Modul byl úspěšně aktualizován');
    },
    onError: (error) => {
      console.error('Error toggling module:', error);
      toast.error('Chyba při aktualizaci modulu');
    },
  });

  // Toggle widget enabled/disabled
  const toggleWidgetMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('company_widgets')
        .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-company-widgets'] });
      queryClient.invalidateQueries({ queryKey: ['company-widgets'] });
      toast.success('Widget byl úspěšně aktualizován');
    },
    onError: (error) => {
      console.error('Error toggling widget:', error);
      toast.error('Chyba při aktualizaci widgetu');
    },
  });

  // Update module configuration
  const updateModuleConfigMutation = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: any }) => {
      const { error } = await supabase
        .from('company_modules')
        .update({ config, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-company-modules'] });
      queryClient.invalidateQueries({ queryKey: ['company-modules'] });
      toast.success('Konfigurace modulu byla aktualizována');
    },
    onError: (error) => {
      console.error('Error updating module config:', error);
      toast.error('Chyba při aktualizaci konfigurace');
    },
  });

  // Update widget configuration
  const updateWidgetConfigMutation = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: any }) => {
      const { error } = await supabase
        .from('company_widgets')
        .update({ config, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-company-widgets'] });
      queryClient.invalidateQueries({ queryKey: ['company-widgets'] });
      toast.success('Konfigurace widgetu byla aktualizována');
    },
    onError: (error) => {
      console.error('Error updating widget config:', error);
      toast.error('Chyba při aktualizaci konfigurace');
    },
  });

  // Bulk toggle modules for a company
  const bulkToggleModulesMutation = useMutation({
    mutationFn: async ({ company, isEnabled }: { company: CompanyType; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('company_modules')
        .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
        .eq('company', company);

      if (error) throw error;
    },
    onSuccess: (_, { company, isEnabled }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-company-modules'] });
      queryClient.invalidateQueries({ queryKey: ['company-modules'] });
      toast.success(`Všechny moduly pro ${company} byly ${isEnabled ? 'povoleny' : 'zakázány'}`);
    },
    onError: (error) => {
      console.error('Error bulk toggling modules:', error);
      toast.error('Chyba při hromadné aktualizaci modulů');
    },
  });

  // Bulk toggle widgets for a company
  const bulkToggleWidgetsMutation = useMutation({
    mutationFn: async ({ company, isEnabled }: { company: CompanyType; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('company_widgets')
        .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
        .eq('company', company);

      if (error) throw error;
    },
    onSuccess: (_, { company, isEnabled }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-company-widgets'] });
      queryClient.invalidateQueries({ queryKey: ['company-widgets'] });
      toast.success(`Všechny widgety pro ${company} byly ${isEnabled ? 'povoleny' : 'zakázány'}`);
    },
    onError: (error) => {
      console.error('Error bulk toggling widgets:', error);
      toast.error('Chyba při hromadné aktualizaci widgetů');
    },
  });

  return {
    // Data
    allModules,
    allWidgets,
    isLoading: isLoadingModules || isLoadingWidgets,

    // Module operations
    toggleModule: toggleModuleMutation.mutate,
    updateModuleConfig: updateModuleConfigMutation.mutate,
    bulkToggleModules: bulkToggleModulesMutation.mutate,
    isTogglingModule: toggleModuleMutation.isPending,
    isUpdatingModuleConfig: updateModuleConfigMutation.isPending,
    isBulkTogglingModules: bulkToggleModulesMutation.isPending,

    // Widget operations
    toggleWidget: toggleWidgetMutation.mutate,
    updateWidgetConfig: updateWidgetConfigMutation.mutate,
    bulkToggleWidgets: bulkToggleWidgetsMutation.mutate,
    isTogglingWidget: toggleWidgetMutation.isPending,
    isUpdatingWidgetConfig: updateWidgetConfigMutation.isPending,
    isBulkTogglingWidgets: bulkToggleWidgetsMutation.isPending,
  };
};