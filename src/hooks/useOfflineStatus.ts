
import * as React from 'react';

interface UseOfflineStatusResult {
  isOffline: boolean;
  lastOnlineAt: Date | null;
}

export const useOfflineStatus = (): UseOfflineStatusResult => {
  const [isOffline, setIsOffline] = React.useState<boolean>(!navigator.onLine);
  const [lastOnlineAt, setLastOnlineAt] = React.useState<Date | null>(
    navigator.onLine ? new Date() : null
  );

  React.useEffect(() => {
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
