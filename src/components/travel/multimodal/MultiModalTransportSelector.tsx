import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, 
  Bus, 
  Train, 
  Bike, 
  MapPin, 
  Clock, 
  Euro, 
  Leaf, 
  Users,
  Navigation,
  TrendingUp,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TransportMode {
  mode_name: string;
  display_name_cs: string;
  display_name_de: string;
  display_name_pl: string;
  icon_name: string;
  carbon_factor: number;
  is_active: boolean;
}

interface RouteOption {
  transport_mode: string;
  display_name: string;
  icon: React.ComponentType<any>;
  duration: number; // minutes
  distance: number; // km
  cost: number; // EUR
  carbon_footprint: number; // kg CO2
  traffic_impact: 'low' | 'medium' | 'high';
  weather_impact: 'low' | 'medium' | 'high';
  optimization_score: number;
  advantages: string[];
  disadvantages: string[];
}

interface MultiModalTransportSelectorProps {
  origin: string;
  destination: string;
  onRouteSelect: (route: RouteOption) => void;
  selectedCriteria: 'time' | 'cost' | 'eco' | 'balanced';
  onCriteriaChange: (criteria: 'time' | 'cost' | 'eco' | 'balanced') => void;
}

const iconMap = {
  car: Car,
  bus: Bus,
  train: Train,
  bike: Bike,
  walk: MapPin,
  users: Users
};

export const MultiModalTransportSelector: React.FC<MultiModalTransportSelectorProps> = ({
  origin,
  destination,
  onRouteSelect,
  selectedCriteria,
  onCriteriaChange
}) => {
  const [transportModes, setTransportModes] = useState<TransportMode[]>([]);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const { t } = useTranslation('travel');
  const { toast } = useToast();

  useEffect(() => {
    loadTransportModes();
  }, []);

  useEffect(() => {
    if (origin && destination && transportModes.length > 0) {
      optimizeRoutes();
    }
  }, [origin, destination, transportModes, selectedCriteria]);

  const loadTransportModes = async () => {
    try {
      const { data, error } = await supabase
        .from('transport_modes')
        .select('*')
        .eq('is_active', true)
        .order('mode_name');

      if (error) throw error;
      setTransportModes(data || []);
    } catch (error) {
      console.error('Error loading transport modes:', error);
      toast({
        title: t('error'),
        description: 'Nepodařilo se načíst dopravní prostředky',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const optimizeRoutes = async () => {
    if (!origin || !destination) return;
    
    setOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('route-optimization', {
        body: {
          origin,
          destination,
          optimizationCriteria: selectedCriteria,
          userId: null // Add user ID if available
        }
      });

      if (error) throw error;

      // Transform the response into RouteOption format
      const options: RouteOption[] = data.optimized_routes?.map((route: any) => ({
        transport_mode: route.transport_mode,
        display_name: route.display_name,
        icon: iconMap[route.icon as keyof typeof iconMap] || Car,
        duration: route.duration,
        distance: route.distance,
        cost: route.cost,
        carbon_footprint: route.carbon_footprint,
        traffic_impact: route.traffic_impact,
        weather_impact: route.weather_impact,
        optimization_score: route.optimization_score,
        advantages: generateAdvantages(route),
        disadvantages: generateDisadvantages(route)
      })) || [];

      setRouteOptions(options);
    } catch (error) {
      console.error('Error optimizing routes:', error);
      // Fallback to mock data
      setRouteOptions(generateMockRoutes());
    } finally {
      setOptimizing(false);
    }
  };

  const generateMockRoutes = (): RouteOption[] => {
    return [
      {
        transport_mode: 'driving',
        display_name: 'Auto',
        icon: Car,
        duration: 35,
        distance: 25.5,
        cost: 6.38,
        carbon_footprint: 5.36,
        traffic_impact: 'medium',
        weather_impact: 'low',
        optimization_score: 85,
        advantages: ['Rychlé', 'Pohodlné', 'Flexibilní'],
        disadvantages: ['Drahé', 'Emise CO₂', 'Parkování']
      },
      {
        transport_mode: 'public_transport',
        display_name: 'MHD',
        icon: Bus,
        duration: 45,
        distance: 28.2,
        cost: 2.50,
        carbon_footprint: 1.41,
        traffic_impact: 'low',
        weather_impact: 'low',
        optimization_score: 78,
        advantages: ['Levné', 'Ekologické', 'Bez stresu'],
        disadvantages: ['Pomalejší', 'Jízdní řády', 'Přestupy']
      },
      {
        transport_mode: 'cycling',
        display_name: 'Kolo',
        icon: Bike,
        duration: 60,
        distance: 25.5,
        cost: 0,
        carbon_footprint: 0,
        traffic_impact: 'low',
        weather_impact: 'high',
        optimization_score: 72,
        advantages: ['Zdarma', 'Zdravé', 'Ekologické'],
        disadvantages: ['Počasí', 'Fyzicky náročné', 'Bezpečnost']
      }
    ];
  };

  const generateAdvantages = (route: any): string[] => {
    const advantages = [];
    if (route.cost < 3) advantages.push('Levné');
    if (route.carbon_footprint < 2) advantages.push('Ekologické');
    if (route.duration < 40) advantages.push('Rychlé');
    if (route.traffic_impact === 'low') advantages.push('Bez zácpy');
    return advantages;
  };

  const generateDisadvantages = (route: any): string[] => {
    const disadvantages = [];
    if (route.cost > 5) disadvantages.push('Drahé');
    if (route.carbon_footprint > 4) disadvantages.push('Emise CO₂');
    if (route.duration > 50) disadvantages.push('Pomalé');
    if (route.weather_impact === 'high') disadvantages.push('Počasí');
    return disadvantages;
  };

  const getCriteriaIcon = (criteria: string) => {
    switch (criteria) {
      case 'time': return Clock;
      case 'cost': return Euro;
      case 'eco': return Leaf;
      case 'balanced': return TrendingUp;
      default: return Clock;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Načítání dopravních prostředků...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Optimization Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Optimalizační kritéria
          </CardTitle>
          <CardDescription>
            Vyberte, co je pro vás nejdůležitější
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCriteria} onValueChange={(value: any) => onCriteriaChange(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Čas
              </TabsTrigger>
              <TabsTrigger value="cost" className="flex items-center gap-2">
                <Euro className="h-4 w-4" />
                Cena
              </TabsTrigger>
              <TabsTrigger value="eco" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Ekologie
              </TabsTrigger>
              <TabsTrigger value="balanced" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Vyvážené
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="time" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Priorita na nejrychlejší dopravu bez ohledu na cenu nebo ekologii.
              </p>
            </TabsContent>
            <TabsContent value="cost" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Hledáme nejlevnější možnost dopravy s přiměřeným časem.
              </p>
            </TabsContent>
            <TabsContent value="eco" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Zaměřujeme se na nejekologičtější způsob dopravy.
              </p>
            </TabsContent>
            <TabsContent value="balanced" className="mt-4">
              <p className="text-sm text-muted-foreground">
                Vyvážený poměr času, ceny a ekologie.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Route Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Doporučené trasy
            {optimizing && <span className="text-sm text-muted-foreground">(Optimalizuji...)</span>}
          </CardTitle>
          <CardDescription>
            {origin && destination ? `${origin} → ${destination}` : 'Zadejte výchozí a cílové místo'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!origin || !destination ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Zadejte výchozí a cílové místo pro zobrazení tras</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {routeOptions.map((route, index) => {
                  const IconComponent = route.icon;
                  return (
                    <motion.div
                      key={route.transport_mode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onRouteSelect(route)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{route.display_name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Progress value={route.optimization_score} className="w-16 h-2" />
                              <span className="text-xs text-muted-foreground">
                                {route.optimization_score}%
                              </span>
                            </div>
                          </div>
                        </div>
                        {index === 0 && (
                          <Badge variant="default">
                            Doporučeno
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{route.duration} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{route.cost.toFixed(2)} €</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{route.carbon_footprint.toFixed(2)} kg CO₂</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{route.distance.toFixed(1)} km</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant={getImpactColor(route.traffic_impact)}>
                          Doprava: {route.traffic_impact}
                        </Badge>
                        <Badge variant={getImpactColor(route.weather_impact)}>
                          Počasí: {route.weather_impact}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-green-600 mb-1">Výhody:</h4>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {route.advantages.map((adv, i) => (
                              <li key={i}>{adv}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-orange-600 mb-1">Nevýhody:</h4>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {route.disadvantages.map((dis, i) => (
                              <li key={i}>{dis}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiModalTransportSelector;