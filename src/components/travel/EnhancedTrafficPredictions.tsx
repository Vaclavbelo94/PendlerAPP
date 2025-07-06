import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, AlertTriangle, TrendingUp, RefreshCw, Navigation, Cloud, Thermometer, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import QuickRouteSelector from './QuickRouteSelector';
import { TrafficAlertsManagerLazy, MultiModalTransportSelectorLazy } from './LazyTravelComponents';
import { motion } from 'framer-motion';

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
  weatherImpact?: {
    temperature: number;
    conditions: string;
    visibility: string;
    impact: 'low' | 'medium' | 'high';
  };
}

const EnhancedTrafficPredictions: React.FC = () => {
  const { t } = useTranslation('travel');
  const { quickRoutes, hasAddresses } = useUserAddresses();
  const [selectedRoute, setSelectedRoute] = useState('custom');
  const [customOrigin, setCustomOrigin] = useState('');
  const [customDestination, setCustomDestination] = useState('');
  const [predictions, setPredictions] = useState<TrafficPrediction | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'predictions' | 'alerts' | 'multimodal'>('predictions');
  const [optimizationCriteria, setOptimizationCriteria] = useState<'time' | 'cost' | 'eco' | 'balanced'>('balanced');

  // Enhanced mock data s weather informacemi
  const mockPredictions: Record<string, TrafficPrediction> = {
    'home-to-work': {
      route: hasAddresses && quickRoutes.length > 0 ? quickRoutes[0].label : 'Domov → Práce',
      currentTime: 28,
      predictedTime: 35,
      trafficLevel: 'medium',
      incidents: ['Zpomalení na D1 kvůli hustému provozu', 'Uzavírka jednoho pruhu na R10'],
      bestDepartureTime: '07:15',
      alternativeRoutes: [
        { name: 'Přes centrum', time: 32, traffic: 'high' },
        { name: 'Okružní trasa', time: 40, traffic: 'low' }
      ],
      weatherImpact: {
        temperature: 8,
        conditions: 'Lehký déšť',
        visibility: 'Snížená (2-5 km)',
        impact: 'medium'
      }
    },
    'work-to-home': {
      route: hasAddresses && quickRoutes.length > 1 ? quickRoutes[1].label : 'Práce → Domov',
      currentTime: 32,
      predictedTime: 45,
      trafficLevel: 'high',
      incidents: ['Nehoda na křižovatce Karlovo náměstí', 'Zvýšený provoz během špičky'],
      bestDepartureTime: '16:30',
      alternativeRoutes: [
        { name: 'Přes Vinohrady', time: 38, traffic: 'medium' },
        { name: 'Metro + pěšky', time: 35, traffic: 'low' }
      ],
      weatherImpact: {
        temperature: 12,
        conditions: 'Oblačno',
        visibility: 'Dobrá (>10 km)',
        impact: 'low'
      }
    },
    'custom': {
      route: customOrigin && customDestination ? `${customOrigin} → ${customDestination}` : 'Vlastní trasa',
      currentTime: 45,
      predictedTime: 55,
      trafficLevel: 'medium',
      incidents: ['Běžný provoz'],
      bestDepartureTime: '08:00',
      alternativeRoutes: [
        { name: 'Hlavní trasa', time: 55, traffic: 'medium' },
        { name: 'Alternativní trasa', time: 62, traffic: 'low' }
      ]
    }
  };

  useEffect(() => {
    if (selectedRoute !== 'custom') {
      loadPredictions();
    }
  }, [selectedRoute]);

  const handleRouteSelect = (origin: string, destination: string) => {
    setCustomOrigin(origin);
    setCustomDestination(destination);
    setSelectedRoute('custom');
  };

  const handleViewChange = (view: 'predictions' | 'alerts' | 'multimodal') => {
    setActiveView(view);
  };

  const handleMultiModalRouteSelect = (route: any) => {
    console.log('Selected multi-modal route:', route);
    // Handle route selection logic here
  };

  const loadPredictions = async () => {
    setIsLoading(true);
    // Simulace načítání z API
    setTimeout(() => {
      setPredictions(mockPredictions[selectedRoute]);
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 800);
  };

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-500';
      case 'medium': return 'bg-amber-500';
      case 'high': return 'bg-orange-500';
      case 'very-high': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const getTrafficLabel = (level: string) => {
    const labels = {
      low: 'Nízký',
      medium: 'Střední',
      high: 'Vysoký',
      'very-high': 'Velmi vysoký'
    };
    return labels[level as keyof typeof labels] || 'Neznámý';
  };

  const getWeatherIcon = (conditions: string) => {
    if (conditions.includes('déšť')) return <Cloud className="h-4 w-4" />;
    return <Thermometer className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t('smartNavigation')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={activeView === 'predictions' ? 'default' : 'outline'}
              onClick={() => handleViewChange('predictions')}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              {t('trafficAnalysis')}
            </Button>
            <Button
              variant={activeView === 'multimodal' ? 'default' : 'outline'}
              onClick={() => handleViewChange('multimodal')}
              className="flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              {t('multiModalTransport')}
            </Button>
            <Button
              variant={activeView === 'alerts' ? 'default' : 'outline'}  
              onClick={() => handleViewChange('alerts')}
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              {t('trafficAlerts')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content based on active view */}
      {activeView === 'predictions' && (
        <>
          {/* Quick Routes */}
          {hasAddresses && (
            <QuickRouteSelector 
              onRouteSelect={handleRouteSelect}
              className="lg:max-w-md"
            />
          )}

          <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('predictiveTraffic')}
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
                  {quickRoutes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Vlastní trasa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadPredictions}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {t('routeOptions')}
            </Button>
          </div>

          {/* Custom route inputs */}
          {selectedRoute === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 block">{t('from')}</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder={t('enterOriginAddress')}
                  value={customOrigin}
                  onChange={(e) => setCustomOrigin(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t('to')}</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder={t('enterDestinationAddress')}
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                />
              </div>
            </div>
          )}

          {predictions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hlavní metriky */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t('currentTraffic')}</span>
                  </div>
                  <p className="text-2xl font-bold">{predictions.currentTime} min</p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t('estimatedArrival')}</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">{predictions.predictedTime} min</p>
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

              {/* Weather Impact */}
              {predictions.weatherImpact && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {getWeatherIcon(predictions.weatherImpact.conditions)}
                      {t('weatherImpact')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Teplota:</span>
                        <p className="font-medium">{predictions.weatherImpact.temperature}°C</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Podmínky:</span>
                        <p className="font-medium">{predictions.weatherImpact.conditions}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Viditelnost:</span>
                        <p className="font-medium">{predictions.weatherImpact.visibility}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dopad:</span>
                        <Badge variant={predictions.weatherImpact.impact === 'high' ? 'destructive' : 'secondary'}>
                          {getTrafficLabel(predictions.weatherImpact.impact)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Doporučení */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    <span className="font-medium">{t('bestDepartureTime')}</span>
                  </div>
                  <p className="text-lg font-bold text-primary">{predictions.bestDepartureTime}</p>
                  <p className="text-sm text-muted-foreground">
                    Pro minimální dobu jízdy doporučujeme odjet v {predictions.bestDepartureTime}
                  </p>
                </CardContent>
              </Card>

              {/* Incidenty */}
              {predictions.incidents.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-5 w-5" />
                      {t('trafficIncidents')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {predictions.incidents.map((incident, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                          <span className="text-sm">{incident}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Alternativní trasy */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('alternativeRoutes')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions.alternativeRoutes.map((route, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{route.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Provoz: {getTrafficLabel(route.traffic)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{route.time} min</p>
                          <Badge variant="outline" className={`text-white ${getTrafficColor(route.traffic)}`}>
                            {getTrafficLabel(route.traffic)}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Poslední aktualizace */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                Poslední aktualizace: {lastUpdate.toLocaleTimeString()}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
        </>
      )}

      {activeView === 'multimodal' && (
        <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded"></div>}>
          <MultiModalTransportSelectorLazy
            origin={customOrigin}
            destination={customDestination}
            onRouteSelect={handleMultiModalRouteSelect}
            selectedCriteria={optimizationCriteria}
            onCriteriaChange={setOptimizationCriteria}
          />
        </Suspense>
      )}

      {activeView === 'alerts' && (
        <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded"></div>}>
          <TrafficAlertsManagerLazy />
        </Suspense>
      )}
    </div>
  );
};

export default EnhancedTrafficPredictions;