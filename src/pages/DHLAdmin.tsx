
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, Users, Calendar, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useDHLAuth } from '@/hooks/useDHLAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { DHLPosition, DHLWorkGroup } from '@/types/dhl';
import { POSITION_TYPE_NAMES, getPositionTypeColor, formatHourlyRate } from '@/utils/dhl/dhlUtils';

const DHLAdmin: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { user } = useAuth();
  const { canAccessDHLAdmin, isLoading } = useDHLAuth();
  const { positions, workGroups, isLoading: dataLoading, error, refetch } = useDHLData();
  const { success, error: showError } = useStandardizedToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Show loading state
  if (isLoading || dataLoading) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Načítám DHL administraci...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Check access
  if (!canAccessDHLAdmin) {
    return (
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Přístup zamítnut</h2>
            <p className="text-muted-foreground">
              Nemáte oprávnění k přístupu do DHL administrace.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Mock statistics - in real implementation, these would come from database
  const stats = {
    totalEmployees: 247,
    activeAssignments: 156,
    totalPositions: positions.length,
    totalWorkGroups: workGroups.length,
    pendingSetups: 12,
    thisMonthShifts: 1834
  };

  const positionColumns = [
    {
      accessorKey: 'name',
      header: 'Název pozice',
    },
    {
      accessorKey: 'position_type',
      header: 'Typ',
      cell: ({ row }) => {
        const type = row.getValue('position_type') as string;
        return (
          <Badge className={getPositionTypeColor(type as any)}>
            {POSITION_TYPE_NAMES[type as keyof typeof POSITION_TYPE_NAMES] || type}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'hourly_rate',
      header: 'Hodinová sazba',
      cell: ({ row }) => formatHourlyRate(row.getValue('hourly_rate')),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>
          {row.getValue('is_active') ? 'Aktivní' : 'Neaktivní'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Akce',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const workGroupColumns = [
    {
      accessorKey: 'name',
      header: 'Název skupiny',
    },
    {
      accessorKey: 'week_number',
      header: 'Číslo týdne',
      cell: ({ row }) => `Týden ${row.getValue('week_number')}`,
    },
    {
      accessorKey: 'description',
      header: 'Popis',
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>
          {row.getValue('is_active') ? 'Aktivní' : 'Neaktivní'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Akce',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <Helmet>
        <title>DHL Administrace | PendlerApp</title>
        <meta name="description" content="DHL system administration panel" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-yellow-500/5">
        <div className="container max-w-7xl py-8 px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-red-500/20 backdrop-blur-sm">
                  <Truck className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                    DHL Administrace
                  </h1>
                  <p className="text-lg text-muted-foreground mt-2">
                    Správa DHL systému a zaměstnanců
                  </p>
                </div>
              </div>
              <Button onClick={() => refetch()}>
                <Settings className="h-4 w-4 mr-2" />
                Obnovit data
              </Button>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Celkem zaměstnanců
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Aktivní přiřazení
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeAssignments}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pozice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPositions}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pracovní skupiny
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalWorkGroups}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Čeká na nastavení
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pendingSetups}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Směny tento měsíc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.thisMonthShifts}</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Přehled</TabsTrigger>
                <TabsTrigger value="positions">Pozice</TabsTrigger>
                <TabsTrigger value="workgroups">Pracovní skupiny</TabsTrigger>
                <TabsTrigger value="employees">Zaměstnanci</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Nedávná aktivita</CardTitle>
                      <CardDescription>Nejnovější změny v systému</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">Nový zaměstnanec přiřazen k pozici Technik</p>
                            <p className="text-xs text-muted-foreground">Před 2 hodinami</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">Aktualizovány směnové šablony pro Woche 5</p>
                            <p className="text-xs text-muted-foreground">Před 4 hodinami</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">12 zaměstnanců čeká na dokončení nastavení</p>
                            <p className="text-xs text-muted-foreground">Před 1 dnem</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Rychlé akce</CardTitle>
                      <CardDescription>Nejčastěji používané funkce</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 p-4">
                          <div className="text-center">
                            <Plus className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm">Nová pozice</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="h-20 p-4">
                          <div className="text-center">
                            <Users className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm">Import zaměstnanců</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="h-20 p-4">
                          <div className="text-center">
                            <Calendar className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm">Generovat směny</span>
                          </div>
                        </Button>
                        <Button variant="outline" className="h-20 p-4">
                          <div className="text-center">
                            <Settings className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm">Nastavení systému</span>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="positions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>DHL Pozice</CardTitle>
                        <CardDescription>Správa dostupných pracovních pozic</CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Přidat pozici
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      columns={positionColumns}
                      data={positions}
                      searchKey="name"
                      searchPlaceholder="Hledat pozice..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="workgroups" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Pracovní skupiny</CardTitle>
                        <CardDescription>Správa týdenních pracovních skupin</CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Přidat skupinu
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      columns={workGroupColumns}
                      data={workGroups}
                      searchKey="name"
                      searchPlaceholder="Hledat pracovní skupiny..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="employees" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>DHL Zaměstnanci</CardTitle>
                        <CardDescription>Správa zaměstnanců a jejich přiřazení</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          Import CSV
                        </Button>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Přidat zaměstnance
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Seznam zaměstnanců bude implementován v další fázi</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default DHLAdmin;
