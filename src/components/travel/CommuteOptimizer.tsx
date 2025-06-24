
import React, { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import OptimizerForm from './optimizer/OptimizerForm';
import ResultsDisplay from './optimizer/ResultsDisplay';
import { useAuth } from '@/hooks/useAuth';
import { routeService } from '@/services/routeService';
import { useTranslation } from 'react-i18next';

const CommuteOptimizer = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('07:30');
  const [transportModes, setTransportModes] = useState<string[]>(['car', 'public']);
  const [optimizationPreference, setOptimizationPreference] = useState('time');
  const [optimized, setOptimized] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { t } = useTranslation('travel');
  
  const handleTransportToggle = (mode: string) => {
    setTransportModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };
  
  const handleOptimize = async () => {
    if (!origin || !destination) {
      return;
    }
    
    // Přidat do historie vyhledávání
    if (user?.id) {
      try {
        await routeService.addSearchHistory({
          user_id: user.id,
          origin_address: origin,
          destination_address: destination
        });
      } catch (error) {
        console.error('Error adding search history:', error);
      }
    }
    
    toast({
      title: t('routeOptions'),
      description: `${t('fastestRoute')}: ${origin} → ${destination}`,
    });
    
    setOptimized(true);
  };

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
      <OptimizerForm
        origin={origin}
        destination={destination}
        departureTime={departureTime}
        transportModes={transportModes}
        optimizationPreference={optimizationPreference}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
        onDepartureTimeChange={setDepartureTime}
        onTransportModeToggle={handleTransportToggle}
        onPreferenceChange={setOptimizationPreference}
        onOptimize={handleOptimize}
      />
      
      <ResultsDisplay 
        hasInput={Boolean(origin && destination && optimized)}
        origin={origin}
        destination={destination}
        transportModes={transportModes}
        optimizationPreference={optimizationPreference}
      />
    </div>
  );
};

export default CommuteOptimizer;
