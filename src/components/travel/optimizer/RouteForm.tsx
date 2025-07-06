
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Clock } from 'lucide-react';
import { MobileOptimizedCard } from '@/components/ui/mobile-optimized-card';
import { useTranslation } from 'react-i18next';
import QuickRouteSelector from '../QuickRouteSelector';

interface RouteFormProps {
  origin: string;
  destination: string;
  departureTime: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onDepartureTimeChange: (value: string) => void;
  onOptimize: () => void;
}

const RouteForm: React.FC<RouteFormProps> = ({
  origin,
  destination,
  departureTime,
  onOriginChange,
  onDestinationChange,
  onDepartureTimeChange,
  onOptimize
}) => {
  const { t } = useTranslation('travel');

  const handleRouteSelect = (selectedOrigin: string, selectedDestination: string) => {
    onOriginChange(selectedOrigin);
    onDestinationChange(selectedDestination);
  };

  return (
    <div className="space-y-4">
      {/* Quick Route Selector */}
      <QuickRouteSelector 
        onRouteSelect={handleRouteSelect}
      />
      
      <MobileOptimizedCard title={t('routeOptimization')} compact>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('originPlace')}
              </Label>
              <Input
                id="origin"
                placeholder={t('enterOriginAddress')}
                value={origin}
                onChange={(e) => onOriginChange(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('destinationPlace')}
              </Label>
              <Input
                id="destination"
                placeholder={t('enterDestinationAddress')}
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departure" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('departureTime')}
              </Label>
              <Input
                id="departure"
                type="time"
                value={departureTime}
                onChange={(e) => onDepartureTimeChange(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={onOptimize}
            className="w-full"
            disabled={!origin || !destination}
          >
            {t('routeOptimization')}
          </Button>
        </div>
      </MobileOptimizedCard>
    </div>
  );
};

export default RouteForm;
