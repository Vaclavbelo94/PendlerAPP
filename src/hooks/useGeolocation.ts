import { useState, useCallback, useEffect, useRef } from 'react';

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: options.enableHighAccuracy ?? false,
    timeout: options.timeout ?? 10000,
    maximumAge: options.maximumAge ?? 0
  };

  // Check if geolocation is supported
  const isSupported = 'geolocation' in navigator;

  // Request permission (implicit through getCurrentPosition)
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError('Geolocation is not supported');
      return false;
    }

    try {
      const result = await new Promise<boolean>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setHasPermission(true);
            resolve(true);
          },
          (err) => {
            setHasPermission(false);
            setError(err.message);
            resolve(false);
          },
          { ...defaultOptions, timeout: 5000 }
        );
      });
      
      return result;
    } catch (err) {
      setHasPermission(false);
      return false;
    }
  }, [isSupported, defaultOptions]);

  // Get current position once
  const getCurrentPosition = useCallback(async () => {
    if (!isSupported) {
      setError('Geolocation is not supported');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, defaultOptions);
      });

      const newPosition: Position = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        altitude: pos.coords.altitude,
        altitudeAccuracy: pos.coords.altitudeAccuracy,
        heading: pos.coords.heading,
        speed: pos.coords.speed,
        timestamp: pos.timestamp
      };

      setPosition(newPosition);
      setHasPermission(true);
      setError(null);
      return newPosition;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get location';
      setError(errorMessage);
      setHasPermission(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, defaultOptions]);

  // Watch position continuously
  const watchPosition = useCallback(() => {
    if (!isSupported) {
      setError('Geolocation is not supported');
      return;
    }

    // Stop existing watch if any
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition: Position = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          altitudeAccuracy: pos.coords.altitudeAccuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp
        };

        setPosition(newPosition);
        setHasPermission(true);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setHasPermission(false);
      },
      defaultOptions
    );

    watchIdRef.current = id;
  }, [isSupported, defaultOptions]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = useCallback((
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }, []);

  // Format distance for display
  const formatDistance = useCallback((distanceKm: number): string => {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    position,
    error,
    isLoading,
    hasPermission,
    isSupported,
    requestPermission,
    getCurrentPosition,
    watchPosition,
    stopWatching,
    calculateDistance,
    formatDistance
  };
};
