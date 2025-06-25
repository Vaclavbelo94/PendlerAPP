
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getDHLAuthState, getDHLRedirectPath, DHLAuthState } from '@/utils/dhlAuthUtils';

export const useDHLAuth = () => {
  const { user } = useAuth();
  const [dhlAuthState, setDhlAuthState] = useState<DHLAuthState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDHLAuthState = async () => {
      if (!user) {
        setDhlAuthState(null);
        setIsLoading(false);
        return;
      }

      try {
        const authState = await getDHLAuthState(user);
        setDhlAuthState(authState);
        
        // Handle automatic redirects
        if (authState.needsSetup && window.location.pathname !== '/dhl-setup') {
          window.location.href = '/dhl-setup';
        }
      } catch (error) {
        console.error('Error loading DHL auth state:', error);
        setDhlAuthState(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadDHLAuthState();
  }, [user]);

  const refreshDHLAuthState = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const authState = await getDHLAuthState(user);
      setDhlAuthState(authState);
    } catch (error) {
      console.error('Error refreshing DHL auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dhlAuthState,
    isLoading,
    refreshDHLAuthState,
    isDHLAdmin: dhlAuthState?.isDHLAdmin || false,
    isDHLEmployee: dhlAuthState?.isDHLEmployee || false,
    canAccessDHLAdmin: dhlAuthState?.canAccessDHLAdmin || false,
    canAccessDHLFeatures: dhlAuthState?.canAccessDHLFeatures || false,
    hasAssignment: dhlAuthState?.hasAssignment || false,
    needsSetup: dhlAuthState?.needsSetup || false
  };
};
