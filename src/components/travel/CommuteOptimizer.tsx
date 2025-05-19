
import React, { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import OptimizerForm from './optimizer/OptimizerForm';
import ResultsDisplay from './optimizer/ResultsDisplay';

const CommuteOptimizer = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('07:30');
  const [transportModes, setTransportModes] = useState<string[]>(['car', 'public']);
  const [optimizationPreference, setOptimizationPreference] = useState('time');
  const [optimized, setOptimized] = useState(false);
  const isMobile = useIsMobile();
  
  const handleTransportToggle = (mode: string) => {
    setTransportModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };
  
  const handleOptimize = () => {
    if (!origin || !destination) {
      return;
    }
    
    // In a real implementation, this would call an API to get optimized routes
    toast({
      title: "Trasa optimalizována",
      description: `Byla nalezena nejlepší trasa pro ${origin} → ${destination}.`,
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
      
      <ResultsDisplay hasInput={Boolean(origin && destination && optimized)} />
    </div>
  );
};

export default CommuteOptimizer;
