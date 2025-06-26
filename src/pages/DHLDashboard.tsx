
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDHLRouteGuard } from '@/hooks/dhl/useDHLRouteGuard';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { useOptimizedShiftsManagement } from '@/hooks/shifts/useOptimizedShiftsManagement';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';
import { DHLLayout } from '@/components/dhl/DHLLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Truck, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  MapPin,
  Loader2,
  Settings,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DHLDashboard: React.FC = () => {
  const { user } = useAuth();
  const { canAccess, isLoading, hasAssignment } = useDHLRouteGuard(true);
  const { userAssignment, isLoading: isDataLoading } = useDHLData(user?.id);
  const { shifts, isLoading: isShiftsLoading } = useOptimizedShiftsManagement(user?.id);

  if (isLoading || isDataLoading || isShiftsLoading) {
    return (
      <DHLLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Načítám DHL dashboard...</p>
          </div>
        </div>
      </DHLLayout>
    );
  }

  if (!canAccess) {
    return null;
  }

  // If user doesn't have assignment, show setup prompt
  if (!hasAssignment) {
    return (
      <DHLLayout>
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-yellow-800">DHL Setup požadován</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Pro používání DHL Dashboard je potřeba dokončit základní nastavení.
              </p>
              <Button asChild>
                <Link to="/dhl-setup">
                  Dokončit DHL Setup
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DHLLayout>
    );
  }

  // Get current week number using proper calculation
  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek) + 1;
  };

  const currentWeek = getCurrentWeek();
  const currentMonth = new Date().toLocaleDateString('cs-CZ', { month: 'long' });
  const totalShifts = shifts?.length || 0;
  const thisMonthShifts = shifts?.filter(shift => {
    const shiftDate = new Date(shift.date);
    const currentDate = new Date();
    return shiftDate.getMonth() === currentDate.getMonth() && 
           shiftDate.getFullYear() === currentDate.getFullYear();
  }).length || 0;

  return (
    <DHLLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DHL Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Vítejte zpět, {user?.email?.split('@')[0]}!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
              <Truck className="h-3 w-3 mr-1" />
              {userAssignment?.dhl_position?.name}
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              <Users className="h-3 w-3 mr-1" />
              {userAssignment?.dhl_work_group?.name}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Směny celkem</p>
                  <p className="text-2xl font-bold text-gray-900">{totalShifts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tento měsíc</p>
                  <p className="text-2xl font-bold text-gray-900">{thisMonthShifts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aktuální týden</p>
                  <p className="text-2xl font-bold text-gray-900">{currentWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-sm font-bold text-green-600">Aktivní</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Assignment Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Aktuální přiřazení
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">DHL Pozice</h4>
                  <p className="text-gray-600">{userAssignment?.dhl_position?.name}</p>
                  {userAssignment?.dhl_position?.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {userAssignment.dhl_position.description}
                    </p>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Pracovní skupina</h4>
                  <p className="text-gray-600">{userAssignment?.dhl_work_group?.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Týden {userAssignment?.dhl_work_group?.week_number}
                  </p>
                </div>
              </div>
              
              {userAssignment?.reference_date && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Referenční bod</h4>
                  <p className="text-blue-700">
                    Datum: {new Date(userAssignment.reference_date).toLocaleDateString('cs-CZ')}
                  </p>
                  {userAssignment.reference_woche && (
                    <p className="text-blue-700">
                      Woche: {userAssignment.reference_woche}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rychlé akce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="default" className="w-full justify-start">
                <Link to="/shifts">
                  <Calendar className="h-4 w-4 mr-2" />
                  Zobrazit směny
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dhl-setup">
                  <Settings className="h-4 w-4 mr-2" />
                  Upravit nastavení
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Můj profil
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {shifts && shifts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Poslední směny</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shifts.slice(-5).reverse().map((shift) => (
                  <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {new Date(shift.date).toLocaleDateString('cs-CZ')}
                        </p>
                        <p className="text-sm text-gray-600">{shift.type}</p>
                      </div>
                    </div>
                    <Badge variant={shift.is_dhl_managed ? "default" : "secondary"}>
                      {shift.is_dhl_managed ? "DHL" : "Manuální"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips and Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Vaše směny jsou automaticky generovány podle vašeho DHL plánu. 
            Můžete je upravovat v sekci Směny nebo měnit nastavení v DHL Setup.
          </AlertDescription>
        </Alert>
      </div>
    </DHLLayout>
  );
};

export default DHLDashboard;
