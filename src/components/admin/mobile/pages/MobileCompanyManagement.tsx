import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Building2, 
  Users, 
  Settings,
  ToggleLeft,
  ToggleRight,
  CreditCard,
  BarChart3,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompanyModulesAdmin } from '@/hooks/useCompanyModulesAdmin';

export const MobileCompanyManagement: React.FC = () => {
  const { hasPermission, companyMenuItems, toggleCompanyMenuItem, isTogglingMenuItem } = useAdminV2();
  const [activeTab, setActiveTab] = useState('overview');

  // Company modules hook
  const { 
    allModules, 
    isLoading: isLoadingModules,
    toggleModule,
    isTogglingModule 
  } = useCompanyModulesAdmin();

  // Company stats
  const { data: companyStats } = useQuery({
    queryKey: ['mobile-company-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('company, is_premium, created_at');

      if (error) throw error;

      const companies = {
        dhl: { 
          total: data?.filter(u => u.company === 'dhl')?.length || 0,
          premium: data?.filter(u => u.company === 'dhl' && u.is_premium)?.length || 0
        },
        adecco: { 
          total: data?.filter(u => u.company === 'adecco')?.length || 0,
          premium: data?.filter(u => u.company === 'adecco' && u.is_premium)?.length || 0
        },
        randstad: { 
          total: data?.filter(u => u.company === 'randstad')?.length || 0,
          premium: data?.filter(u => u.company === 'randstad' && u.is_premium)?.length || 0
        }
      };

      return companies;
    },
    enabled: hasPermission('admin')
  });

  if (!hasPermission('admin')) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nedostatečná oprávnění</h2>
          <p className="text-muted-foreground">
            Pro správu firem potřebujete oprávnění administrátora nebo vyšší.
          </p>
        </CardContent>
      </Card>
    );
  }

  const companyData = [
    {
      id: 'dhl',
      name: 'DHL',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Building2,
      stats: companyStats?.dhl
    },
    {
      id: 'adecco', 
      name: 'Adecco',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Building2,
      stats: companyStats?.adecco
    },
    {
      id: 'randstad',
      name: 'Randstad',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: Building2,
      stats: companyStats?.randstad
    }
  ];

  const CompanyOverview = () => (
    <div className="space-y-4">
      {companyData.map((company) => (
        <Card key={company.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${company.color}`}>
                  <company.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">Firemní účet</p>
                </div>
              </div>
              <Badge className={company.color}>
                Aktivní
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{company.stats?.total || 0}</p>
                <p className="text-xs text-muted-foreground">Celkem uživatelů</p>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold">{company.stats?.premium || 0}</p>
                <p className="text-xs text-muted-foreground">Premium uživatelů</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistiky
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Nastavení
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const MenuManagement = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            Položky menu
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Přidat
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {companyMenuItems?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="text-xs">
                    {item.company.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-medium truncate">{item.title_cs}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{item.route}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={item.is_enabled}
                  onCheckedChange={(checked) => 
                    toggleCompanyMenuItem({ id: item.id, isEnabled: checked })
                  }
                  disabled={isTogglingMenuItem}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const ModuleManagement = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Firemní moduly</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingModules ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Načítání modulů...</p>
            </div>
          ) : (
            allModules?.map((module) => (
              <div key={module.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="text-xs">
                      {module.company.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium truncate">{module.module_key}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Firemní modul
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={module.is_enabled}
                    onCheckedChange={(checked) => 
                      toggleModule({ id: module.id, isEnabled: checked })
                    }
                    disabled={isTogglingModule}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Správa firem</h1>
        <p className="text-muted-foreground">
          Spravujte firemní účty, moduly a nastavení
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="modules">Moduly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <CompanyOverview />
        </TabsContent>
        
        <TabsContent value="menu" className="mt-4">
          <MenuManagement />
        </TabsContent>
        
        <TabsContent value="modules" className="mt-4">
          <ModuleManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};