import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, DollarSign, Leaf, Car, Train, Bus, Bike, Save } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { routeService } from '@/services/routeService';
import { toast } from '@/hooks/use-toast';

interface RouteOption {
  id: string;
  transportMode: string;
  duration: number;
  cost: number;
  co2Emissions: number;
  description: string;
  steps: string[];
}

interface ResultsDisplayProps {
  hasInput: boolean;
  origin?: string;
  destination?: string;
  transportModes?: string[];
  optimizationPreference?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  hasInput,
  origin,
  destination,
  transportModes = [],
  optimizationPreference = 'time'
}) => {
  const { user } = useAuth();

  // Mock data pro demonstraci - v produkci by se načítalo z API
  const mockRoutes: RouteOption[] = [
    {
      id: '1',
      transportMode: 'car',
      duration: 45,
      cost: 120,
      co2Emissions: 12.5,
      description: 'Přímá cesta autem',
      steps: ['Výjezd z domova', 'Dálnice A6', 'Vjezd do Německa', 'Příjezd do cíle']
    },
    {
      id: '2',
      transportMode: 'public',
      duration: 75,
      cost: 45,
      co2Emissions: 3.2,
      description: 'Veřejná doprava',
      steps: ['Autobus na nádraží', 'Vlak do Chebu', 'Přestup na německý vlak', 'Příjezd']
    },
    {
      id: '3',
      transportMode: 'mix',
      duration: 60,
      cost: 80,
      co2Emissions: 7.8,
      description: 'Kombinovaná doprava',
      steps: ['Auto k nádraží', 'Vlak do Německa', 'Autobus do cíle']
    }
  ];

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'car': return <Car className="h-4 w-4" />;
      case 'public': return <Train className="h-4 w-4" />;
      case 'bus': return <Bus className="h-4 w-4" />;
      case 'bike': return <Bike className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const handleSaveRoute = async (route: RouteOption) => {
    if (!user || !origin || !destination) {
      toast({
        title: "Chyba",
        description: "Pro uložení trasy musíte být přihlášeni a mít zadané výchozí a cílové místo.",
        variant: "destructive"
      });
      return;
    }

    try {
      const routeData = {
        user_id: user.id,
        name: `${origin} → ${destination}`,
        origin_address: origin,
        destination_address: destination,
        transport_modes: [route.transportMode],
        optimization_preference: optimizationPreference,
        route_data: {
          duration: route.duration,
          cost: route.cost,
          co2Emissions: route.co2Emissions,
          steps: route.steps
        }
      };

      await routeService.saveRoute(routeData);
      
      toast({
        title: "Úspěch",
        description: "Trasa byla uložena."
      });
    } catch (error) {
      console.error('Error saving route:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit trasu.",
        variant: "destructive"
      });
    }
  };

  const sortRoutesByPreference = (routes: RouteOption[]) => {
    switch (optimizationPreference) {
      case 'time':
        return routes.sort((a, b) => a.duration - b.duration);
      case 'cost':
        return routes.sort((a, b) => a.cost - b.cost);
      case 'eco':
        return routes.sort((a, b) => a.co2Emissions - b.co2Emissions);
      default:
        return routes;
    }
  };

  if (!hasInput) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <MapPin className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Zadejte výchozí a cílové místo pro zobrazení optimalizovaných tras.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedRoutes = sortRoutesByPreference(mockRoutes);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Optimalizované trasy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedRoutes.map((route, index) => (
              <div
                key={route.id}
                className={`p-4 border rounded-lg ${
                  index === 0 ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getTransportIcon(route.transportMode)}
                    <h3 className="font-medium">{route.description}</h3>
                    {index === 0 && (
                      <Badge variant="default">Doporučeno</Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveRoute(route)}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-3 w-3" />
                    Uložit
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{route.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{route.cost} Kč</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{route.co2Emissions} kg CO₂</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Kroky cesty:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    {route.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
