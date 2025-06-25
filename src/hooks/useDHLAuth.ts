
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getDHLAuthState, DHLAuthState } from '@/utils/dhlAuthUtils';

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
        console.log('Loading DHL auth state for user:', user.id, user.email);
        const authState = await getDHLAuthState(user);
        console.log('DHL auth state loaded:', authState);
        setDhlAuthState(authState);
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
      console.log('Refreshing DHL auth state...');
      const authState = await getDHLAuthState(user);
      console.log('DHL auth state refreshed:', authState);
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
