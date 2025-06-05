
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { OfflineDataManager } from './core/OfflineDataManager';
import { OnlineSyncManager } from './core/OnlineSyncManager';
import { serviceWorkerManager } from '@/services/AdvancedServiceWorker';
import { optimizeMemory } from '@/utils/offlineStorage';

const OfflineManager: React.FC = () => {
  const { user } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { settings } = useSyncSettings();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [hasShownOnlineToast, setHasShownOnlineToast] = useState(false);
  const [isNativeMode] = useState(() => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.userAgent.includes('PendlerApp');
  });

  // Initialize offline capabilities
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize service worker
        await serviceWorkerManager.initialize();
        
        // Request notification permission if in native mode
        if (isNativeMode) {
          await serviceWorkerManager.requestNotificationPermission();
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize offline manager:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    initialize();
  }, [isNativeMode]);

  // Memory optimization
  useEffect(() => {
    const interval = setInterval(() => {
      optimizeMemory();
    }, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Handle service worker updates
  useEffect(() => {
    const handleUpdate = () => {
      console.log('Service worker update available');
      // Could show update notification to user
    };

    window.addEventListener('sw-update-available', handleUpdate);
    return () => window.removeEventListener('sw-update-available', handleUpdate);
  }, []);

  // Reset online toast when going offline
  useEffect(() => {
    if (isOffline) {
      setHasShownOnlineToast(false);
    }
  }, [isOffline]);

  const handleOfflineToastReset = () => {
    // This is called from OfflineDataManager after showing offline toast
  };

  const handleOnlineToastShown = () => {
    setHasShownOnlineToast(true);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <OfflineDataManager
        isInitialized={isInitialized}
        isNativeMode={isNativeMode}
        isCheckingStatus={isCheckingStatus}
        onOfflineToastReset={handleOfflineToastReset}
      />
      
      <OnlineSyncManager
        isInitialized={isInitialized}
        isNativeMode={isNativeMode}
        isCheckingStatus={isCheckingStatus}
        hasShownOnlineToast={hasShownOnlineToast}
        onOnlineToastShown={handleOnlineToastShown}
      />
    </>
  );
};

export default OfflineManager;
