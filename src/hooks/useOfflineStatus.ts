
import React, { useState, useEffect } from 'react';

interface UseOfflineStatusResult {
  isOffline: boolean;
  lastOnlineAt: Date | null;
}

export const useOfflineStatus = (): UseOfflineStatusResult => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(
    navigator.onLine ? new Date() : null
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setLastOnlineAt(new Date());
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOffline, lastOnlineAt };
};

export default useOfflineStatus;
