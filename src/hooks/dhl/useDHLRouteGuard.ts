
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';
import { useDHLData } from './useDHLData';

export const useDHLRouteGuard = (requiresSetup = false) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { userAssignment, isLoading: isDHLDataLoading } = useDHLData(user?.id);

  useEffect(() => {
    if (isLoading || isDHLDataLoading) return;

    // Check if user can access DHL features
    if (!canAccessDHLFeatures(user)) {
      console.log('User cannot access DHL features, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }

    // If setup is required but user doesn't have assignment, redirect to setup
    if (requiresSetup && !userAssignment) {
      console.log('DHL user needs setup, redirecting to setup page');
      navigate('/dhl-setup');
      return;
    }

    // If user has assignment but is on setup page, redirect to dashboard
    if (!requiresSetup && userAssignment && window.location.pathname === '/dhl-setup') {
      console.log('DHL user already has setup, redirecting to dashboard');
      navigate('/dhl-dashboard');
      return;
    }
  }, [user, userAssignment, isLoading, isDHLDataLoading, requiresSetup, navigate]);

  return {
    canAccess: !isLoading && !isDHLDataLoading && canAccessDHLFeatures(user),
    hasAssignment: !!userAssignment,
    isLoading: isLoading || isDHLDataLoading
  };
};
