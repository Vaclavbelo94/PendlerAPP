import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminV2 } from '@/hooks/useAdminV2';
import { useCompanyModulesAdmin } from '@/hooks/useCompanyModulesAdmin';
import { Building2, Settings, Users, ToggleLeft, ToggleRight } from 'lucide-react';

const companies = [
  {
    id: 'dhl',
    name: 'DHL',
    displayName: 'DHL Express',
    color: '#FFCC00',
    description: 'Logistics and express delivery services',
    features: ['Wechselschicht', 'Overtime tracking', 'Document management'],
  },
  {
    id: 'adecco',
    name: 'Adecco',
    displayName: 'Adecco Group',
    color: '#0052CC',
    description: 'Human resources and staffing solutions',
    features: ['Assignment management', 'Timesheets', 'Training modules'],
  },
  {
    id: 'randstad',
    name: 'Randstad',
    displayName: 'Randstad NV',
    color: '#FFB300',
    description: 'Flexible work and HR services',
    features: ['Flexible work', 'Skills development', 'Feedback systems'],
  },
];

export const CompanyManagementV2: React.FC = () => {
  const { companyMenuItems, toggleCompanyMenuItem, isTogglingMenuItem } = useAdminV2();
  const { 
    allModules, 
    allWidgets, 
    isLoading: isLoadingModules,
    toggleModule,
    toggleWidget,
    bulkToggleModules,
    bulkToggleWidgets,
    isTogglingModule,
    isTogglingWidget
  } = useCompanyModulesAdmin();
  const [selectedCompany, setSelectedCompany] = useState('dhl');

  const getCompanyMenuItems = (companyId: string) => {
    return companyMenuItems?.filter(item => item.company === companyId) || [];
  };

  const handleToggleMenuItem = (itemId: string, currentStatus: boolean) => {
    toggleCompanyMenuItem({ id: itemId, isEnabled: !currentStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Správa firem</h1>
        <p className="text-muted-foreground">
          Spravujte nastavení a funkce pro jednotlivé firmy
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="menu-management">Správa menu</TabsTrigger>
          <TabsTrigger value="settings">Nastavení</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Company Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            {companies.map((company) => (
              <Card key={company.id} className="relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: company.color }}
                />
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="h-5 w-5" />
                    {company.displayName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {company.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Dostupné funkce:</h4>
                    <div className="flex flex-wrap gap-1">
                      {company.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Menu položky:</span>
                      <Badge variant="outline">
                        {getCompanyMenuItems(company.id).length} aktivních
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="menu-management" className="space-y-6">
          {/* Company Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Výběr firmy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {companies.map((company) => (
                  <Button
                    key={company.id}
                    variant={selectedCompany === company.id ? "default" : "outline"}
                    onClick={() => setSelectedCompany(company.id)}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Building2 className="h-5 w-5" />
                    <span>{company.displayName}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Items Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                Menu položky - {companies.find(c => c.id === selectedCompany)?.displayName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCompanyMenuItems(selectedCompany).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title_cs}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description_cs}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.route}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Pořadí: {item.display_order}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant={item.is_enabled ? "default" : "secondary"}>
                        {item.is_enabled ? "Aktivní" : "Neaktivní"}
                      </Badge>
                      <Switch
                        checked={item.is_enabled}
                        onCheckedChange={() => handleToggleMenuItem(item.id, item.is_enabled)}
                        disabled={isTogglingMenuItem}
                      />
                    </div>
                  </div>
                ))}
                
                {getCompanyMenuItems(selectedCompany).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Žádné menu položky pro vybranou firmu</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Globální nastavení firem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automatické přiřazování menu</h4>
                    <p className="text-sm text-muted-foreground">
                      Automaticky přiřadit nové menu položky při registraci
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sdílení napříč firmami</h4>
                    <p className="text-sm text-muted-foreground">
                      Povolit sdílení funkcí mezi firmami
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Logging změn</h4>
                    <p className="text-sm text-muted-foreground">
                      Zaznamenávat všechny změny menu položek
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};