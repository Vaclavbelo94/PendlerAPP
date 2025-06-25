
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, Settings, BarChart3, Bell, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useDHLShifts } from '@/hooks/dhl/useDHLShifts';
import DHLShiftCalendar from './DHLShiftCalendar';
import LoadingSpinner from '@/components/LoadingSpinner';

const DHLDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userAssignment, isLoading: dhlDataLoading } = useDHLData(user?.id);
  const { 
    dhlShifts, 
    shiftTemplates, 
    isLoading: shiftsLoading, 
    generateDHLShifts, 
    overrideDHLShift, 
    restoreDHLShift 
  } = useDHLShifts(user?.id);

  const [activeTab, setActiveTab] = useState('overview');

  if (dhlDataLoading || shiftsLoading) {
    return <LoadingSpinner />;
  }

  if (!userAssignment || !userAssignment.is_active) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Žádné DHL přiřazení</h3>
            <p className="text-muted-foreground mb-4">
              Nemáte aktivní DHL přiřazení. Kontaktujte administrátora nebo dokončete DHL setup.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/dhl-setup'}>
              Přejít na DHL Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    totalShifts: dhlShifts.length,
    overriddenShifts: dhlShifts.filter(s => s.dhl_override).length,
    upcomingShifts: dhlShifts.filter(s => new Date(s.date) > new Date()).length,
    templatesCount: shiftTemplates.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-yellow-600" />
        <div>
          <h1 className="text-2xl font-bold">DHL Dashboard</h1>
          <p className="text-muted-foreground">
            {userAssignment.dhl_position?.name} - {userAssignment.dhl_work_group?.name}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Celkem směn</p>
                <p className="text-2xl font-bold">{stats.totalShifts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Upravených</p>
                <p className="text-2xl font-bold">{stats.overriddenShifts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Nadcházejících</p>
                <p className="text-2xl font-bold">{stats.upcomingShifts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Šablony směn</p>
                <p className="text-2xl font-bold">{stats.templatesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Vaše DHL přiřazení
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Pozice</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{userAssignment.dhl_position?.position_type}</Badge>
                  <span className="font-medium">{userAssignment.dhl_position?.name}</span>
                </div>
                {userAssignment.dhl_position?.description && (
                  <p className="text-sm text-muted-foreground">
                    {userAssignment.dhl_position.description}
                  </p>
                )}
                {userAssignment.dhl_position?.hourly_rate && (
                  <p className="text-sm font-medium text-green-600">
                    Hodinová sazba: {userAssignment.dhl_position.hourly_rate.toFixed(2)} €/hod
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Pracovní skupina</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Týden {userAssignment.dhl_work_group?.week_number}</Badge>
                  <span className="font-medium">{userAssignment.dhl_work_group?.name}</span>
                </div>
                {userAssignment.dhl_work_group?.description && (
                  <p className="text-sm text-muted-foreground">
                    {userAssignment.dhl_work_group.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Přiřazeno: {new Date(userAssignment.assigned_at).toLocaleDateString('cs-CZ')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Přehled</TabsTrigger>
          <TabsTrigger value="calendar">Kalendář</TabsTrigger>
          <TabsTrigger value="templates">Šablony</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Nejbližší směny</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.upcomingShifts === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Žádné nadcházející směny
                  </p>
                ) : (
                  <div className="space-y-2">
                    {dhlShifts
                      .filter(s => new Date(s.date) > new Date())
                      .slice(0, 5)
                      .map((shift) => (
                        <div key={shift.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Badge size="sm" variant={shift.dhl_override ? "destructive" : "default"}>
                              {shift.type === 'morning' ? 'Ranní' : shift.type === 'afternoon' ? 'Odpolední' : 'Noční'}
                            </Badge>
                            <span className="text-sm">
                              {new Date(shift.date).toLocaleDateString('cs-CZ')}
                            </span>
                          </div>
                          {shift.dhl_override && (
                            <Badge variant="outline" size="sm">
                              Upraveno
                            </Badge>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rychlé akce</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('calendar')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Zobrazit kalendář směn
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('templates')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Zobrazit šablony směn
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifikace (Připravuje se)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <DHLShiftCalendar
            dhlShifts={dhlShifts}
            onOverrideShift={overrideDHLShift}
            onRestoreShift={restoreDHLShift}
            onGenerateShifts={generateDHLShifts}
            isLoading={shiftsLoading}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Šablony směn pro vaši pozici</CardTitle>
            </CardHeader>
            <CardContent>
              {shiftTemplates.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Pro vaši pozici a pracovní skupinu nejsou definovány žádné šablony směn.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shiftTemplates.map((template) => (
                    <Card key={template.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'][template.day_of_week]}
                          </Badge>
                          {template.is_required && (
                            <Badge variant="destructive" size="sm">
                              Povinná
                            </Badge>
                          )}
                        </div>
                        <div className="text-lg font-medium">
                          {template.start_time} - {template.end_time}
                        </div>
                        {template.break_duration && (
                          <p className="text-sm text-muted-foreground">
                            Přestávka: {template.break_duration} min
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DHLDashboard;
