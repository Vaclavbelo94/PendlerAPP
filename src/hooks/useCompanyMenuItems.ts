import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from './useCompany';
import { useTranslation } from 'react-i18next';

export interface CompanyMenuItem {
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

export const useCompanyMenuItems = () => {
  const { company } = useCompany();
  const { i18n } = useTranslation();

  const { data: menuItems = [], isLoading, error } = useQuery({
    queryKey: ['company-menu-items', company],
    queryFn: async () => {
      console.log('🔍 Fetching menu items for company:', company);
      if (!company) return [];

      const { data, error } = await supabase
        .from('company_menu_items')
        .select('*')
        .eq('company', company)
        .eq('is_enabled', true)
        .order('display_order');

      console.log('📊 Menu items query result:', { data, error, company });
      if (error) throw error;
      return data as CompanyMenuItem[];
    },
    enabled: !!company,
  });

  // Debug logging
  console.log('🎯 useCompanyMenuItems Debug:', {
    company,
    isLoading,
    error,
    menuItemsCount: menuItems.length,
    menuItems,
    queryEnabled: !!company
  });

  // Get localized menu items
  const getLocalizedMenuItems = () => {
    const currentLang = i18n.language;
    
    return menuItems.map(item => ({
      ...item,
      title: getCurrentTitle(item, currentLang),
      description: getCurrentDescription(item, currentLang),
    }));
  };

  const getCurrentTitle = (item: CompanyMenuItem, lang: string): string => {
    switch (lang) {
      case 'de':
        return item.title_de || item.title_cs;
      case 'pl':
        return item.title_pl || item.title_cs;
      default:
        return item.title_cs;
    }
  };

  const getCurrentDescription = (item: CompanyMenuItem, lang: string): string | null => {
    switch (lang) {
      case 'de':
        return item.description_de || item.description_cs;
      case 'pl':
        return item.description_pl || item.description_cs;
      default:
        return item.description_cs;
    }
  };

  // Group menu items for grid layout (2x2)
  const getGridMenuItems = () => {
    const localizedItems = getLocalizedMenuItems();
    const pairs = [];
    
    for (let i = 0; i < localizedItems.length; i += 2) {
      pairs.push(localizedItems.slice(i, i + 2));
    }
    
    return pairs;
  };

  return {
    menuItems,
    localizedMenuItems: getLocalizedMenuItems(),
    gridMenuItems: getGridMenuItems(),
    isLoading,
    company,
  };
};