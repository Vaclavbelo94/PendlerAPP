
import { useState, useEffect, useCallback } from 'react';

interface OfflineStatusState {
  isOffline: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  lastOnlineAt: Date | null;
  lastOfflineAt: Date | null;
}

export const useOfflineStatus = () => {
  const [state, setState] = useState<OfflineStatusState>({
    isOffline: !navigator.onLine,
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    lastOnlineAt: navigator.onLine ? new Date() : null,
    lastOfflineAt: !navigator.onLine ? new Date() : null
  });

  // Enhanced connection detection
  const getConnectionInfo = useCallback(() => {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        connectionType: connection.type || 'unknown',
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0
      };
    }
    
    return {
      connectionType: 'unknown',
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0
    };
  }, []);

  // Test actual connectivity with fallback endpoints
  const testConnectivity = useCallback(async (): Promise<boolean> => {
    const testUrls = [
      'https://www.google.com/favicon.ico',
      'https://www.cloudflare.com/favicon.ico',
      'https://httpbin.org/status/200'
    ];

    for (const url of testUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return true;
      } catch (error) {
        continue;
      }
    }
    
    return false;
  }, []);

  // Handle online/offline events
  const handleOnline = useCallback(async () => {
    const connectionInfo = getConnectionInfo();
    
    // Verify actual connectivity
    const isReallyOnline = await testConnectivity();
    
    setState(prev => ({
      ...prev,
      isOffline: !isReallyOnline,
      ...connectionInfo,
      lastOnlineAt: isReallyOnline ? new Date() : prev.lastOnlineAt
    }));

    if (isReallyOnline) {
      // Trigger sync when coming online
      window.dispatchEvent(new CustomEvent('connection-restored'));
    }
  }, [getConnectionInfo, testConnectivity]);

  const handleOffline = useCallback(() => {
    const connectionInfo = getConnectionInfo();
    
    setState(prev => ({
      ...prev,
      isOffline: true,
      ...connectionInfo,
      lastOfflineAt: new Date()
    }));

    // Notify app about offline status
    window.dispatchEvent(new CustomEvent('connection-lost'));
  }, [getConnectionInfo]);

  // Handle connection change
  const handleConnectionChange = useCallback(() => {
    const connectionInfo = getConnectionInfo();
    
    setState(prev => ({
      ...prev,
      ...connectionInfo
    }));
  }, [getConnectionInfo]);

  // Periodic connectivity check
  const periodicCheck = useCallback(async () => {
    if (navigator.onLine) {
      const isReallyOnline = await testConnectivity();
      
      setState(prev => {
        if (prev.isOffline !== !isReallyOnline) {
          return {
            ...prev,
            isOffline: !isReallyOnline,
            lastOnlineAt: isReallyOnline ? new Date() : prev.lastOnlineAt,
            lastOfflineAt: !isReallyOnline ? new Date() : prev.lastOfflineAt
          };
        }
        return prev;
      });
    }
  }, [testConnectivity]);

  useEffect(() => {
    // Initial check
    handleOnline();

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Connection change listener
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Periodic check every 30 seconds
    const interval = setInterval(periodicCheck, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
      
      clearInterval(interval);
    };
  }, [handleOnline, handleOffline, handleConnectionChange, periodicCheck]);

  // Force refresh connectivity status
  const refreshStatus = useCallback(() => {
    handleOnline();
  }, [handleOnline]);

  // Check if connection is slow
  const isSlowConnection = useCallback(() => {
    return state.effectiveType === 'slow-2g' || 
           state.effectiveType === '2g' || 
           state.downlink < 0.5;
  }, [state.effectiveType, state.downlink]);

  return {
    ...state,
    refreshStatus,
    isSlowConnection: isSlowConnection(),
    hasConnectionInfo: state.connectionType !== 'unknown'
  };
};
