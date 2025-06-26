
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDHLRouteGuard } from '@/hooks/dhl/useDHLRouteGuard';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { DHLLayout } from '@/components/dhl/DHLLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Truck, 
  Car, 
  Fuel, 
  MapPin, 
  Clock, 
  Calculator,
  FileText,
  Info
} from 'lucide-react';

const DHLVehicle: React.FC = () => {
  const { user } = useAuth();
  const { canAccess, isLoading } = useDHLRouteGuard(true);
  const { userAssignment, isLoading: isDHLLoading } = useDHLData(user?.id);

  if (isLoading || isDHLLoading) {
    return (
      <DHLLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Načítám DHL vozidlo...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">DHL Vozidlo</h1>
            <p className="text-gray-600 mt-1">
              Správa služebního vozidla a dojíždění
            </p>
          </div>
          <Badge variant="outline" className="text-yellow-600 border-yellow-300 w-fit">
            <Truck className="h-3 w-3 mr-1" />
            DHL Vozidlo
          </Badge>
        </div>

        {/* DHL Vehicle Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Truck className="h-5 w-5" />
                DHL Služební vozidlo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-1">
                    <Car className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Typ vozidla</span>
                  </div>
                  <p className="text-sm text-gray-600">DHL Dodávka</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-1">
                    <Fuel className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Palivo</span>
                  </div>
                  <p className="text-sm text-gray-600">Nafta</p>
                </div>
              </div>
              
              <div className="p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Pracovní oblast</span>
                </div>
                <p className="text-sm text-gray-600">
                  {userAssignment?.dhl_work_group?.name || 'Nespecifikováno'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                DHL Náklady na dojíždění
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Denní km</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">~80 km</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Fuel className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Náklady/den</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">~320 Kč</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Exportovat cestovní náklady
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* DHL Specific Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>DHL Zaměstnanci:</strong> Služební vozidla jsou spravována centrálně. 
            Pro změny kontaktujte DHL fleet management nebo svého supervizora.
          </AlertDescription>
        </Alert>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Rychlé akce</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="default" className="w-full justify-start">
              <Calculator className="h-4 w-4 mr-2" />
              Kalkulačka cestovních nákladů
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Exportovat měsíční report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Plánování tras
            </Button>
          </CardContent>
        </Card>
      </div>
    </DHLLayout>
  );
};

export default DHLVehicle;
