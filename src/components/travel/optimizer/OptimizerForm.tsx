
import React from 'react';
import RouteForm from './RouteForm';
import TransportModeSelector from './TransportModeSelector';
import OptimizationPreference from './OptimizationPreference';
import SavedRoutes from './SavedRoutes';
import { SavedRoute } from '@/services/routeService';
import { useIsMobile } from '@/hooks/use-mobile';

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

const OptimizerForm: React.FC<OptimizerFormProps> = ({
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
}) => {
  const isMobile = useIsMobile();

  const handleRouteSelect = (route: SavedRoute) => {
    onOriginChange(route.origin_address);
    onDestinationChange(route.destination_address);
    // Reset transport modes to the saved ones
    route.transport_modes.forEach(mode => {
      if (!transportModes.includes(mode)) {
        onTransportModeToggle(mode);
      }
    });
    onPreferenceChange(route.optimization_preference);
  };

  return (
    <div className={`space-y-4 ${isMobile ? 'space-y-3' : ''}`}>
      <RouteForm
        origin={origin}
        destination={destination}
        departureTime={departureTime}
        onOriginChange={onOriginChange}
        onDestinationChange={onDestinationChange}
        onDepartureTimeChange={onDepartureTimeChange}
        onOptimize={onOptimize}
      />
      
      <TransportModeSelector
        selectedModes={transportModes}
        onModeToggle={onTransportModeToggle}
      />
      
      <OptimizationPreference
        value={optimizationPreference}
        onChange={onPreferenceChange}
      />
      
      <SavedRoutes onRouteSelect={handleRouteSelect} />
    </div>
  );
};

export default OptimizerForm;
