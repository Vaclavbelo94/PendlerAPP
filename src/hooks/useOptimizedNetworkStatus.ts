
import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  lastOnlineAt: Date | null;
  pingTime: number | null;
}

export const useOptimizedNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionType: 'unknown',
    lastOnlineAt: navigator.onLine ? new Date() : null,
    pingTime: null
  });

  const checkConnectionSpeed = useCallback(async () => {
    if (!navigator.onLine) return;

    const startTime = performance.now();
    try {
      await fetch('/manifest.json', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      const pingTime = performance.now() - startTime;
      
      setStatus(prev => ({
        ...prev,
        pingTime,
        isSlowConnection: pingTime > 1000
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isSlowConnection: true,
        pingTime: null
      }));
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: true,
        lastOnlineAt: new Date()
      }));
      checkConnectionSpeed();
    };

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        pingTime: null
      }));
    };

    // Get connection info if available
    const getConnectionInfo = () => {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        setStatus(prev => ({
          ...prev,
          connectionType: conn.effectiveType || 'unknown',
          isSlowConnection: conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g'
        }));
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    getConnectionInfo();
    if (navigator.onLine) {
      checkConnectionSpeed();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnectionSpeed]);

  return status;
};
