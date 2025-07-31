import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyModuleCard } from './CompanyModuleCard';
import { BulkActionToolbar } from './BulkActionToolbar';
import { useCompanyModulesAdmin } from '@/hooks/useCompanyModulesAdmin';
import { CompanyType } from '@/types/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Grid3X3 } from 'lucide-react';
import SimpleLoadingSpinner from '@/components/loading/SimpleLoadingSpinner';

export const CompanyModulesPanel = () => {
  const { allModules, allWidgets, isLoading } = useCompanyModulesAdmin();
  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(null);

  if (isLoading) {
    return <SimpleLoadingSpinner message="Načítám správu modulů..." />;
  }

  const companies: CompanyType[] = [CompanyType.DHL, CompanyType.ADECCO, CompanyType.RANDSTAD];
  
  const getModulesByCompany = (company: CompanyType) => {
    return allModules.filter(module => module.company === company);
  };

  const getWidgetsByCompany = (company: CompanyType) => {
    return allWidgets.filter(widget => widget.company === company);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Správa modulů a widgetů podle firem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Zde můžete povolit nebo zakázat jednotlivé moduly a widgety pro každou firmu. 
            Změny se projeví okamžitě pro všechny uživatele dané firmy.
          </p>

          <BulkActionToolbar 
            selectedCompany={selectedCompany}
            onCompanySelect={setSelectedCompany}
          />

          <Tabs defaultValue="modules" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="modules" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Moduly
              </TabsTrigger>
              <TabsTrigger value="widgets" className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4" />
                Widgety
              </TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="space-y-6 mt-6">
              <div className="grid gap-6">
                {companies.map(company => (
                  <CompanyModuleCard
                    key={`modules-${company}`}
                    company={company}
                    modules={getModulesByCompany(company)}
                    type="module"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="widgets" className="space-y-6 mt-6">
              <div className="grid gap-6">
                {companies.map(company => (
                  <CompanyModuleCard
                    key={`widgets-${company}`}
                    company={company}
                    widgets={getWidgetsByCompany(company)}
                    type="widget"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};