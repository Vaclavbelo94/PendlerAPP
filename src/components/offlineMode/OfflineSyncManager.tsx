import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { syncWithLocalStorage } from '@/utils/offlineStorage';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';
import { AutoSyncManager } from './AutoSyncManager';
import { PremiumStatusManager } from './core/PremiumStatusManager';
import { OfflineDataManager } from './core/OfflineDataManager';
import { OnlineSyncManager } from './core/OnlineSyncManager';
import { isNativeApp } from './core/NativeAppDetector';

export const OfflineSyncManager = () => {
  const { user } = useAuth();
  const { settings } = useSyncSettings();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [hasShownOnlineToast, setHasShownOnlineToast] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isNativeMode, setIsNativeMode] = useState(false);
  const initializeRef = useRef(false);
  const { success: showSuccess, error: showError, info: showInfo } = useStandardizedToast();

  // Initialize native mode detection once
  React.useEffect(() => {
    if (initializeRef.current) return;
    initializeRef.current = true;
    
    const checkNative = () => {
      setIsNativeMode(isNativeApp());
    };
    
    requestAnimationFrame(() => {
      checkNative();
      setIsInitialized(true);
    });
  }, []);

  // Manual sync function
  const manualSync = async () => {
    if (!user) return;
    
    if (settings.showSyncNotifications) {
      showInfo('Synchronizace', 'Probíhá synchronizace vašich dat...');
    }
    
    try {
      await syncWithLocalStorage();
      if (settings.showSyncNotifications) {
        showSuccess('Hotovo', 'Vaše data byla úspěšně synchronizována.');
      }
    } catch (error) {
      console.error('Error during manual sync:', error);
      if (settings.showSyncNotifications) {
        showError('Chyba při synchronizaci', 'Zkontrolujte prosím připojení a zkuste to znovu.');
      }
    }
  };

  return (
    <>
      <PremiumStatusManager
        isInitialized={isInitialized}
        isNativeMode={isNativeMode}
        onStatusCheckComplete={setIsCheckingStatus}
      />
      
      <OfflineDataManager
        isInitialized={isInitialized}
        isNativeMode={isNativeMode}
        isCheckingStatus={isCheckingStatus}
        onOfflineToastReset={() => setHasShownOnlineToast(false)}
      />
      
      <OnlineSyncManager
        isInitialized={isInitialized}
        isNativeMode={isNativeMode}
        isCheckingStatus={isCheckingStatus}
        hasShownOnlineToast={hasShownOnlineToast}
        onOnlineToastShown={() => setHasShownOnlineToast(true)}
      />
      
      <AutoSyncManager 
        syncInterval={settings.syncInterval || 30000}
        enableToasts={settings.showSyncNotifications}
      />
    </>
  );
};

export default React.memo(OfflineSyncManager);
