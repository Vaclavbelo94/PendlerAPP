import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Euro, Leaf, Navigation, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommuteOption {
  id: string;
  mode: string;
  duration: number;
  cost: number;
  co2: number;
  description: string;
  icon: string;
  recommended?: boolean;
}

const DHLCommuteOptimizer: React.FC = () => {
  const { t } = useTranslation('travel');
  const { quickRoutes, hasAddresses, loading } = useUserAddresses();
  const { unifiedUser } = useAuth();
  const { toast } = useToast();
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [commuteOptions, setCommuteOptions] = useState<CommuteOption[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);

  // Load today's shift
  useEffect(() => {
    if (unifiedUser?.id) {
      loadTodayShift();
    }
  }, [unifiedUser]);

  const loadTodayShift = async () => {
    if (!unifiedUser?.id) return;
    
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .eq('date', today)
      .single();

    if (data && !error) {
      setSelectedShift(data);
      setDepartureTime(data.start_time?.slice(0, 5) || '08:00');
    }
  };

  const handleQuickRoute = (route: any) => {
    setOrigin(route.origin);
    setDestination(route.destination);
  };

  const optimizeCommute = async () => {
    if (!origin || !destination) {
      toast({
        title: "Chyba",
        description: "Vyplňte prosím výchozí a cílovou adresu",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    
    // Simulate API call - in real implementation would call route optimization service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockOptions: CommuteOption[] = [
      {
        id: '1',
        mode: 'car',
        duration: 35,
        cost: 12.50,
        co2: 4.2,
        description: 'Osobní auto',
        icon: '🚗',
        recommended: true
      },
      {
        id: '2',
        mode: 'public',
        duration: 52,
        cost: 4.80,
        co2: 1.8,
        description: 'Veřejná doprava',
        icon: '🚌'
      },
      {
        id: '3',
        mode: 'bike',
        duration: 45,
        cost: 0,
        co2: 0,
        description: 'Kolo + MHD',
        icon: '🚴'
      }
    ];

    setCommuteOptions(mockOptions);
    setIsOptimizing(false);

    // Save commute record
    if (unifiedUser?.id) {
      await saveCommuteRecord(mockOptions[0]);
    }
  };

  const saveCommuteRecord = async (option: CommuteOption) => {
    if (!unifiedUser?.id) return;

    const { error } = await supabase
      .from('dhl_commute_records')
      .insert({
        user_id: unifiedUser.id,
        date: new Date().toISOString().split('T')[0],
        origin_address: origin,
        destination_address: destination,
        transport_mode: option.mode,
        duration_minutes: option.duration,
        distance_km: 25, // Mock data
        cost_amount: option.cost,
        fuel_consumption: option.mode === 'car' ? 2.1 : 0,
        is_business_trip: true
      });

    if (error) {
      console.error('Error saving commute record:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-secondary rounded w-3/4"></div>
            <div className="h-4 bg-secondary rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shift Info */}
      {selectedShift && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Dnešní směna</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedShift.start_time?.slice(0, 5)} - {selectedShift.end_time?.slice(0, 5)}
                  {selectedShift.notes && ` • ${selectedShift.notes}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Routes */}
      {hasAddresses && quickRoutes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Rychlé trasy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickRoutes.map((route) => (
              <Button
                key={route.id}
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={() => handleQuickRoute(route)}
              >
                <div className="text-left">
                  <div className="font-medium">{route.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {route.origin}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Route Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Optimalizace trasy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Výchozí bod</Label>
            <Input
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Zadejte adresu..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Cíl</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Zadejte adresu..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departure">Čas odjezdu</Label>
            <Input
              id="departure"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </div>

          <Button 
            onClick={optimizeCommute}
            disabled={isOptimizing || !origin || !destination}
            className="w-full"
          >
            {isOptimizing ? 'Optimalizuji...' : 'Optimalizovat trasu'}
          </Button>
        </CardContent>
      </Card>

      {/* Commute Options */}
      {commuteOptions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Doporučené možnosti</h3>
          {commuteOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={option.recommended ? 'ring-2 ring-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {option.description}
                          {option.recommended && (
                            <Badge variant="default" className="text-xs">
                              Doporučeno
                            </Badge>
                          )}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {option.duration} min
                          </div>
                          <div className="flex items-center gap-1">
                            <Euro className="h-4 w-4" />
                            {option.cost.toFixed(2)} €
                          </div>
                          <div className="flex items-center gap-1">
                            <Leaf className="h-4 w-4" />
                            {option.co2.toFixed(1)} kg CO₂
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DHLCommuteOptimizer;