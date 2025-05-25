
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';

interface TrafficPrediction {
  route: string;
  currentTime: number;
  predictedTime: number;
  trafficLevel: 'low' | 'medium' | 'high' | 'very-high';
  incidents: string[];
  bestDepartureTime: string;
  alternativeRoutes: Array<{
    name: string;
    time: number;
    traffic: string;
  }>;
}

const TrafficPredictions: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState('cheb-dresden');
  const [predictions, setPredictions] = useState<TrafficPrediction | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock data pro demonstraci
  const mockPredictions: Record<string, TrafficPrediction> = {
    'cheb-dresden': {
      route: 'Cheb → Dresden',
      currentTime: 95,
      predictedTime: 110,
      trafficLevel: 'medium',
      incidents: ['Práce na A17 km 45', 'Zvýšený provoz na hraničním přechodu'],
      bestDepartureTime: '06:30',
      alternativeRoutes: [
        { name: 'Přes Karlovy Vary', time: 125, traffic: 'low' },
        { name: 'Přes Chomutov', time: 140, traffic: 'medium' }
      ]
    },
    'karlovy-vary-munich': {
      route: 'Karlovy Vary → Mnichov',
      currentTime: 180,
      predictedTime: 200,
      trafficLevel: 'high',
      incidents: ['Nehoda na A93', 'Kolony před Regensburgem'],
      bestDepartureTime: '05:45',
      alternativeRoutes: [
        { name: 'Přes Plzeň-Furth', time: 220, traffic: 'medium' },
        { name: 'Přes Čes. Budějovice', time: 240, traffic: 'low' }
      ]
    }
  };

  useEffect(() => {
    loadPredictions();
    const interval = setInterval(loadPredictions, 300000); // Aktualizace každých 5 minut
    return () => clearInterval(interval);
  }, [selectedRoute]);

  const loadPredictions = () => {
    // Simulace načítání dat z API
    setTimeout(() => {
      setPredictions(mockPredictions[selectedRoute]);
      setLastUpdate(new Date());
    }, 500);
  };

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'very-high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrafficLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Nízký';
      case 'medium': return 'Střední';
      case 'high': return 'Vysoký';
      case 'very-high': return 'Velmi vysoký';
      default: return 'Neznámý';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Predikce dopravní situace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte trasu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cheb-dresden">Cheb → Dresden</SelectItem>
                  <SelectItem value="karlovy-vary-munich">Karlovy Vary → Mnichov</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={loadPredictions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualizovat
            </Button>
          </div>

          {predictions && (
            <>
              {/* Hlavní informace */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Aktuální doba jízdy</span>
                  </div>
                  <p className="text-2xl font-bold">{predictions.currentTime} min</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Predikovaná doba</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{predictions.predictedTime} min</p>
                  <p className="text-xs text-muted-foreground">
                    +{predictions.predictedTime - predictions.currentTime} min
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Hustota provozu</span>
                  </div>
                  <Badge className={`${getTrafficColor(predictions.trafficLevel)} text-white`}>
                    {getTrafficLabel(predictions.trafficLevel)}
                  </Badge>
                </Card>
              </div>

              {/* Doporučení */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Doporučený čas odjezdu</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">{predictions.bestDepartureTime}</p>
                  <p className="text-sm text-muted-foreground">
                    Pro minimální dobu jízdy doporučujeme odjet v {predictions.bestDepartureTime}
                  </p>
                </CardContent>
              </Card>

              {/* Aktuální incidenty */}
              {predictions.incidents.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-5 w-5" />
                      Aktuální incidenty na trase
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {predictions.incidents.map((incident, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{incident}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Alternativní trasy */}
              <Card>
                <CardHeader>
                  <CardTitle>Alternativní trasy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions.alternativeRoutes.map((route, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{route.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Provoz: {getTrafficLabel(route.traffic)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{route.time} min</p>
                          <Badge variant="outline" className={getTrafficColor(route.traffic)}>
                            {getTrafficLabel(route.traffic)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Poslední aktualizace */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                Poslední aktualizace: {lastUpdate.toLocaleTimeString()}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafficPredictions;
