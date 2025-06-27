
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { isDHLEmployee, getDHLSetupPath } from '@/utils/dhlAuthUtils';
import { useDHLData } from './useDHLData';

export const useDHLRouteGuard = (requiresSetup = false) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { userAssignment, isLoading: isDHLDataLoading } = useDHLData(user?.id);

  useEffect(() => {
    if (isLoading || isDHLDataLoading) return;

    // Check if user is DHL employee
    if (!isDHLEmployee(user)) {
      console.log('User is not DHL employee');
      return;
    }

    // Check if DHL user needs setup
    const setupPath = getDHLSetupPath(user, !!userAssignment);
    
    if (setupPath && requiresSetup) {
      console.log('DHL user needs setup, redirecting to setup page');
      navigate(setupPath);
      return;
    }

    // If user has assignment but is on setup page, redirect to dashboard
    if (!requiresSetup && userAssignment && window.location.pathname === '/dhl-setup') {
      console.log('DHL user already has setup, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
  }, [user, userAssignment, isLoading, isDHLDataLoading, requiresSetup, navigate]);

  return {
    canAccess: !isLoading && !isDHLDataLoading,
    isDHLEmployee: isDHLEmployee(user),
    hasAssignment: !!userAssignment,
    isLoading: isLoading || isDHLDataLoading
  };
};
