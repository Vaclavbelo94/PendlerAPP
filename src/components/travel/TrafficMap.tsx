
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, AlertTriangle, TrendingUp, Navigation } from 'lucide-react';
import { trafficService, TrafficData, WeatherImpact } from '@/services/trafficService';
import { toast } from '@/hooks/use-toast';
import OptimizedAddressAutocomplete from './OptimizedAddressAutocomplete';

interface TrafficMapProps {
  origin: string;
  destination: string;
  onOriginChange?: (value: string) => void;
  onDestinationChange?: (value: string) => void;
}

const TrafficMap: React.FC<TrafficMapProps> = ({ 
  origin, 
  destination, 
  onOriginChange, 
  onDestinationChange 
}) => {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherImpact | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);

  useEffect(() => {
    if (origin && destination) {
      loadTrafficData();
    }
  }, [origin, destination]);

  const loadTrafficData = async () => {
    setLoading(true);
    try {
      const traffic = await trafficService.getTrafficData(origin, destination);
      setTrafficData(traffic);

      // Get weather data for origin (simplified - using Prague coordinates)
      const weather = await trafficService.getWeatherImpact(50.0755, 14.4378);
      setWeatherData(weather);
    } catch (error) {
      console.error('Error loading traffic data:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst dopravní data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrafficColor = (condition: string) => {
    switch (condition) {
      case 'light': return 'bg-green-100 text-green-800';
      case 'normal': return 'bg-yellow-100 text-yellow-800';
      case 'heavy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeatherImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Route Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Trasa
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRouteForm(!showRouteForm)}
            >
              {showRouteForm ? 'Skrýt' : 'Změnit trasu'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showRouteForm ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Výchozí místo</label>
                <OptimizedAddressAutocomplete
                  value={origin}
                  onChange={onOriginChange || (() => {})}
                  placeholder="Zadejte výchozí adresu"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cílové místo</label>
                <OptimizedAddressAutocomplete
                  value={destination}
                  onChange={onDestinationChange || (() => {})}
                  placeholder="Zadejte cílovou adresu"
                />
              </div>
              <Button onClick={loadTrafficData} className="w-full">
                Aktualizovat dopravní informace
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{origin}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">{destination}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Traffic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Aktuální dopravní situace
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Načítám dopravní data...</p>
            </div>
          ) : trafficData?.routes ? (
            <div className="space-y-4">
              {trafficData.routes.map((route, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Trasa {index + 1}</h3>
                    <Badge className={getTrafficColor(route.traffic_conditions)}>
                      {route.traffic_conditions === 'light' ? 'Plynulá' :
                       route.traffic_conditions === 'normal' ? 'Normální' : 'Hustá'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Běžně: {route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>S provozem: {route.duration_in_traffic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Vzdálenost: {route.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Nepodařilo se načíst dopravní data. Zkuste to později.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Weather Impact */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Vliv počasí na dopravu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{weatherData.conditions}</p>
                  <p className="text-sm text-muted-foreground">{weatherData.description}</p>
                  <p className="text-sm text-muted-foreground">{weatherData.temperature}°C</p>
                </div>
                <Badge className={getWeatherImpactColor(weatherData.trafficImpact)}>
                  {weatherData.trafficImpact === 'low' ? 'Nízký vliv' :
                   weatherData.trafficImpact === 'medium' ? 'Střední vliv' : 'Vysoký vliv'}
                </Badge>
              </div>
              
              {weatherData.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Doporučení:</h4>
                  <ul className="space-y-1">
                    {weatherData.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrafficMap;
