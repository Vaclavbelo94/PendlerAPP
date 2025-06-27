
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/auth';
import { useSyncSettings } from '@/hooks/useSyncSettings';
import { toast } from '@/hooks/use-toast';

interface PremiumStatusManagerProps {
  isInitialized: boolean;
  isNativeMode: boolean;
  onStatusCheckComplete: (isChecking: boolean) => void;
}

export const PremiumStatusManager: React.FC<PremiumStatusManagerProps> = ({
  isInitialized,
  isNativeMode,
  onStatusCheckComplete
}) => {
  const { user, refreshPremiumStatus } = useAuth();
  const { settings } = useSyncSettings();

  // Premium status check on initialization
  useEffect(() => {
    let isMounted = true;
    
    const checkPremiumDirectly = async () => {
      if (!user || !isInitialized) {
        if (isMounted) {
          onStatusCheckComplete(false);
        }
        return;
      }
      
      try {
        onStatusCheckComplete(true);
        await refreshPremiumStatus();
      } catch (error) {
        console.error('Chyba při kontrole premium statusu:', error);
      } finally {
        if (isMounted) {
          onStatusCheckComplete(false);
        }
      }
    };
    
    if (user && isInitialized) {
      setTimeout(() => {
        if (isMounted) {
          checkPremiumDirectly();
        }
      }, 1000);
    } else if (isInitialized) {
      onStatusCheckComplete(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, refreshPremiumStatus, isInitialized, onStatusCheckComplete]);

  return null;
};

export default PremiumStatusManager;
