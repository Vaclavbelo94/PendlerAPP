import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from './useCompany';
import { CompanyType } from '@/types/auth';

export interface CompanyModule {
  id: string;
  company: CompanyType;
  module_key: string;
  is_enabled: boolean;
  config: any;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyWidget {
  id: string;
  company: CompanyType;
  widget_key: string;
  is_enabled: boolean;
  config: any;
  display_order: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export const useCompanyModules = () => {
  const { company } = useCompany();

  const { data: modules = [], isLoading: isLoadingModules } = useQuery({
    queryKey: ['company-modules', company],
    queryFn: async () => {
      if (!company) return [];

      const { data, error } = await supabase
        .from('company_modules')
        .select('*')
        .eq('company', company)
        .eq('is_enabled', true)
        .order('display_order');

      if (error) throw error;
      return data as CompanyModule[];
    },
    enabled: !!company,
  });

  const { data: widgets = [], isLoading: isLoadingWidgets } = useQuery({
    queryKey: ['company-widgets', company],
    queryFn: async () => {
      if (!company) return [];

      const { data, error } = await supabase
        .from('company_widgets')
        .select('*')
        .eq('company', company)
        .eq('is_enabled', true)
        .order('display_order');

      if (error) throw error;
      return data as CompanyWidget[];
    },
    enabled: !!company,
  });

  const hasModule = (moduleKey: string) => {
    return modules.some(module => module.module_key === moduleKey);
  };

  const getModuleConfig = (moduleKey: string) => {
    const module = modules.find(m => m.module_key === moduleKey);
    return module?.config || {};
  };

  const hasWidget = (widgetKey: string) => {
    return widgets.some(widget => widget.widget_key === widgetKey);
  };

  const getWidgetConfig = (widgetKey: string) => {
    const widget = widgets.find(w => w.widget_key === widgetKey);
    return widget?.config || {};
  };

  const getWidgetsByCategory = (category: string) => {
    return widgets.filter(widget => widget.category === category);
  };

  return {
    modules,
    widgets,
    isLoading: isLoadingModules || isLoadingWidgets,
    hasModule,
    getModuleConfig,
    hasWidget,
    getWidgetConfig,
    getWidgetsByCategory,
    company,
  };
};