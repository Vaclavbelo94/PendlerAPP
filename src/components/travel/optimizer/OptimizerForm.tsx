
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import RouteForm from './RouteForm';
import TransportModeSelector from './TransportModeSelector';
import OptimizationPreference from './OptimizationPreference';

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
  const handleSubmit = () => {
    if (!origin || !destination) {
      toast({
        title: "Chybí údaje",
        description: "Zadejte prosím místo odjezdu a cíl.",
        variant: "destructive",
      });
      return;
    }
    
    onOptimize();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimalizace dojíždění</CardTitle>
        <CardDescription>Najděte nejefektivnější způsob dojíždění do práce a zpět.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RouteForm
          origin={origin}
          destination={destination}
          departureTime={departureTime}
          onOriginChange={onOriginChange}
          onDestinationChange={onDestinationChange}
          onDepartureTimeChange={onDepartureTimeChange}
        />
        
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
  );
};

export default OptimizerForm;
