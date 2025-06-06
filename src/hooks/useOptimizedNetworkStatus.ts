
import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  effectiveType: string;
}

export const useOptimizedNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() => ({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown',
    effectiveType: 'unknown'
  }));

  const updateNetworkStatus = useCallback(() => {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    const isSlowConnection = connection ? 
      (connection.effectiveType === 'slow-2g' || 
       connection.effectiveType === '2g' ||
       connection.downlink < 1.5) : false;

    setNetworkStatus({
      isOnline: navigator.onLine,
      isSlowConnection,
      connectionType: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown'
    });
  }, []);

  useEffect(() => {
    // Initial check
    updateNetworkStatus();

    // Event listeners
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Connection change listener
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, [updateNetworkStatus]);

  return networkStatus;
};
