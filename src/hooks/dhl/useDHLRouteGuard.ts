
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from './useDHLData';
import { canAccessDHLFeatures, canAccessDHLAdmin } from '@/utils/dhlAuthUtils';

export const useDHLRouteGuard = (requiresSetup: boolean = false) => {
  const { user } = useAuth();
  const { userAssignment, isLoading } = useDHLData(user?.id);
  const navigate = useNavigate();
  const location = useLocation();

  const canAccessDHL = canAccessDHLFeatures(user);
  const canAccessAdmin = canAccessDHLAdmin(user);
  const hasAssignment = !!userAssignment;

  useEffect(() => {
    if (isLoading) return;

    // If user doesn't have DHL access at all, redirect to main dashboard
    if (!canAccessDHL) {
      navigate('/dashboard');
      return;
    }

    // If accessing admin routes but not admin
    if (location.pathname.includes('/dhl-admin') && !canAccessAdmin) {
      navigate('/dhl-dashboard');
      return;
    }

    // If requires setup (dashboard access) but no assignment, redirect to setup
    if (requiresSetup && !hasAssignment && location.pathname !== '/dhl-setup') {
      navigate('/dhl-setup');
      return;
    }

    // If has assignment but on setup page, redirect to dashboard
    if (hasAssignment && location.pathname === '/dhl-setup') {
      navigate('/dhl-dashboard');
      return;
    }
  }, [canAccessDHL, canAccessAdmin, hasAssignment, requiresSetup, isLoading, navigate, location.pathname]);

  return {
    canAccess: canAccessDHL,
    canAccessAdmin,
    hasAssignment,
    isLoading,
    shouldRedirect: isLoading || (!canAccessDHL || (requiresSetup && !hasAssignment))
  };
};
