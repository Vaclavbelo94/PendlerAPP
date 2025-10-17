import React, { useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

interface LocationDisplayProps {
  onLocationChange?: (lat: number, lng: number) => void;
  showMap?: boolean;
  enableTracking?: boolean;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  onLocationChange,
  showMap = false,
  enableTracking = false
}) => {
  const {
    position,
    error,
    isLoading,
    getCurrentPosition,
    watchPosition,
    stopWatching,
    formatDistance
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000
  });

  useEffect(() => {
    if (enableTracking) {
      watchPosition();
      return () => stopWatching();
    }
  }, [enableTracking, watchPosition, stopWatching]);

  useEffect(() => {
    if (position && onLocationChange) {
      onLocationChange(position.latitude, position.longitude);
    }
  }, [position, onLocationChange]);

  const handleGetLocation = () => {
    getCurrentPosition();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location
        </CardTitle>
        <CardDescription>
          {enableTracking ? 'Tracking your location' : 'Get your current location'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {position && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Latitude:</span>
              <span className="font-mono">{position.latitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Longitude:</span>
              <span className="font-mono">{position.longitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accuracy:</span>
              <span>{formatDistance(position.accuracy / 1000)}</span>
            </div>
            {position.speed !== null && position.speed > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Speed:</span>
                <span>{(position.speed * 3.6).toFixed(1)} km/h</span>
              </div>
            )}
          </div>
        )}

        {showMap && position && (
          <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${position.longitude - 0.01},${position.latitude - 0.01},${position.longitude + 0.01},${position.latitude + 0.01}&layer=mapnik&marker=${position.latitude},${position.longitude}`}
              allowFullScreen
            />
          </div>
        )}

        {!enableTracking && (
          <Button
            onClick={handleGetLocation}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Get Current Location
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
