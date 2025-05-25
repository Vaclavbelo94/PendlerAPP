
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { routeService } from "@/services/routeService";
import AddressAutocomplete from '../AddressAutocomplete';
import TransportModeSelector from './TransportModeSelector';
import OptimizationPreference from './OptimizationPreference';
import SavedRoutes from './SavedRoutes';

interface OptimizerFormProps {
  origin: string;
  destination: string;
  departureTime: string;
  transportModes: string[];
  optimizationPreference: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onDepartureTimeChange: (value: string) => void;
  onTransportModeToggle: (mode: string) => void;
  onPreferenceChange: (value: string) => void;
  onOptimize: () => void;
}

const OptimizerForm = ({
  origin,
  destination,
  departureTime,
  transportModes,
  optimizationPreference,
  onOriginChange,
  onDestinationChange,
  onDepartureTimeChange,
  onTransportModeToggle,
  onPreferenceChange,
  onOptimize
}: OptimizerFormProps) => {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadSearchHistory();
    }
  }, [user?.id]);

  const loadSearchHistory = async () => {
    if (!user?.id) return;
    
    try {
      const history = await routeService.getSearchHistory(user.id, 5);
      const uniqueAddresses = Array.from(new Set([
        ...history.map(h => h.origin_address),
        ...history.map(h => h.destination_address)
      ])).filter(Boolean);
      setSearchHistory(uniqueAddresses);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const handleSubmit = async () => {
    if (!origin || !destination) {
      toast.error("Zadejte prosím místo odjezdu a cíl.");
      return;
    }
    
    // Uložit do historie vyhledávání
    if (user?.id) {
      try {
        await routeService.addSearchHistory({
          user_id: user.id,
          origin_address: origin,
          destination_address: destination
        });
        loadSearchHistory(); // Aktualizovat historii
      } catch (error) {
        console.error('Error saving search history:', error);
      }
    }
    
    onOptimize();
  };

  const handleLoadRoute = (route: any) => {
    onOriginChange(route.origin_address);
    onDestinationChange(route.destination_address);
    onPreferenceChange(route.optimization_preference);
    // Načíst transport modes
    route.transport_modes.forEach((mode: string) => {
      if (!transportModes.includes(mode)) {
        onTransportModeToggle(mode);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Optimalizace dojíždění</CardTitle>
          <CardDescription>Najděte nejefektivnější způsob dojíždění do práce a zpět.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="origin" className="text-sm font-medium">Místo odjezdu</label>
            <AddressAutocomplete
              value={origin}
              onChange={onOriginChange}
              placeholder="Zadejte adresu nebo místo odjezdu"
              recentAddresses={searchHistory}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium">Cíl cesty</label>
            <AddressAutocomplete
              value={destination}
              onChange={onDestinationChange}
              placeholder="Zadejte adresu nebo cíl cesty"
              recentAddresses={searchHistory}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="departure-time" className="text-sm font-medium">Čas odjezdu</label>
            <input 
              id="departure-time" 
              type="time" 
              value={departureTime}
              onChange={(e) => onDepartureTimeChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <TransportModeSelector
            selectedModes={transportModes}
            onToggleMode={onTransportModeToggle}
          />
          
          <OptimizationPreference
            preference={optimizationPreference}
            onPreferenceChange={onPreferenceChange}
          />
          
          <Button 
            onClick={handleSubmit}
            className="w-full mt-2"
          >
            Optimalizovat trasu
          </Button>
        </CardContent>
      </Card>

      <SavedRoutes onLoadRoute={handleLoadRoute} />
    </div>
  );
};

export default OptimizerForm;
