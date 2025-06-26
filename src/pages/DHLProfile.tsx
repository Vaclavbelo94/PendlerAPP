
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDHLRouteGuard } from '@/hooks/dhl/useDHLRouteGuard';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { DHLLayout } from '@/components/dhl/DHLLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Truck, Users, MapPin, Settings, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const DHLProfile: React.FC = () => {
  const { user } = useAuth();
  const { canAccess, isLoading } = useDHLRouteGuard(true);
  const { userAssignment, isLoading: isDHLLoading } = useDHLData(user?.id);

  if (isLoading || isDHLLoading) {
    return (
      <DHLLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Načítám DHL profil...</p>
          </div>
        </div>
      </DHLLayout>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    <DHLLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DHL Profil</h1>
            <p className="text-gray-600 mt-1">
              {user?.email?.split('@')[0]} - DHL Zaměstnanec
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
              <Truck className="h-3 w-3 mr-1" />
              DHL Aktivní
            </Badge>
          </div>
        </div>

        {/* DHL Assignment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-yellow-600" />
              DHL Pracovní přiřazení
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">DHL Pozice</span>
                </div>
                <p className="text-gray-700 font-semibold">{userAssignment?.dhl_position?.name}</p>
                {userAssignment?.dhl_position?.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {userAssignment.dhl_position.description}
                  </p>
                )}
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">Pracovní skupina</span>
                </div>
                <p className="text-gray-700 font-semibold">{userAssignment?.dhl_work_group?.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Týden {userAssignment?.dhl_work_group?.week_number}
                </p>
              </div>
            </div>
            
            {userAssignment?.reference_date && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Referenční bod</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p className="text-blue-700">
                    Datum: {new Date(userAssignment.reference_date).toLocaleDateString('cs-CZ')}
                  </p>
                  {userAssignment.reference_woche && (
                    <p className="text-blue-700">
                      Woche: {userAssignment.reference_woche}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Akce profilu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="default" className="w-full justify-start">
              <Link to="/dhl-shifts">
                <Calendar className="h-4 w-4 mr-2" />
                Spravovat DHL směny
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dhl-setup">
                <Settings className="h-4 w-4 mr-2" />
                Upravit DHL nastavení
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DHLLayout>
  );
};

export default DHLProfile;
