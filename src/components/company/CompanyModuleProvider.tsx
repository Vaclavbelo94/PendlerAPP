import React, { createContext, useContext } from 'react';
import { useCompanyModules } from '@/hooks/useCompanyModules';
import { CompanyType } from '@/types/auth';

interface CompanyModuleContextType {
  modules: any[];
  widgets: any[];
  isLoading: boolean;
  hasModule: (moduleKey: string) => boolean;
  getModuleConfig: (moduleKey: string) => any;
  hasWidget: (widgetKey: string) => boolean;
  getWidgetConfig: (widgetKey: string) => any;
  getWidgetsByCategory: (category: string) => any[];
  company: CompanyType | null;
}

const CompanyModuleContext = createContext<CompanyModuleContextType | undefined>(undefined);

export const useCompanyModuleContext = () => {
  const context = useContext(CompanyModuleContext);
  if (!context) {
    throw new Error('useCompanyModuleContext must be used within CompanyModuleProvider');
  }
  return context;
};

interface CompanyModuleProviderProps {
  children: React.ReactNode;
}

export const CompanyModuleProvider: React.FC<CompanyModuleProviderProps> = ({ children }) => {
  const companyModuleData = useCompanyModules();

  return (
    <CompanyModuleContext.Provider value={companyModuleData}>
      {children}
    </CompanyModuleContext.Provider>
  );
};