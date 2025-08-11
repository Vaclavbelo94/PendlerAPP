
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { isDHLEmployee, isDHLAdmin } from '@/utils/dhlAuthUtils';
import { useDHLData } from './useDHLData';

export const useDHLRouteGuard = (requiresSetup = false) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { userAssignment, isLoading: isDHLDataLoading, refetch } = useDHLData(user?.id);
  const [isDHLUser, setIsDHLUser] = useState<boolean | null>(null);
  const [isCheckingDHL, setIsCheckingDHL] = useState(true);

  // Check if user is DHL employee (async check for promo codes)
  useEffect(() => {
    const checkDHLStatus = async () => {
      if (!user) {
        setIsDHLUser(false);
        setIsCheckingDHL(false);
        return;
      }

      // Admin override
      if (isDHLAdmin(user)) {
        setIsDHLUser(true);
        setIsCheckingDHL(false);
        return;
      }

      // Check promo code redemption
      const isDHL = await isDHLEmployee(user);
      setIsDHLUser(isDHL);
      setIsCheckingDHL(false);
    };

    checkDHLStatus();
  }, [user]);

  useEffect(() => {
    if (isLoading || isDHLDataLoading || isCheckingDHL) return;

    const localComplete = user ? localStorage.getItem(`dhlSetupComplete_${user.id}`) === 'true' : false;
    const hasCompleted = !!userAssignment || localComplete;

    // If user is not DHL employee, don't redirect (just return)
    if (!isDHLUser) {
      console.log('User is not DHL employee');
      return;
    }

    // If we have a local completion flag but no assignment yet, try to refetch silently
    if (localComplete && !userAssignment) {
      setTimeout(() => refetch?.(), 0);
    }

    // If page explicitly requires setup and not completed, stay
    if (requiresSetup && !hasCompleted) {
      console.log('DHL user needs setup, staying on setup page');
      return;
    }

    // If setup is completed and user is on setup page, redirect to dashboard
    if (!requiresSetup && hasCompleted && window.location.pathname === '/dhl-setup') {
      console.log('DHL user already has setup, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // If setup not completed and user is not on setup page, redirect to setup
    if (!hasCompleted && window.location.pathname !== '/dhl-setup') {
      console.log('DHL user needs setup, redirecting to setup page');
      navigate('/dhl-setup', { replace: true });
      return;
    }
  }, [user, userAssignment, isLoading, isDHLDataLoading, isCheckingDHL, requiresSetup, navigate, isDHLUser, refetch]);

  return {
    canAccess: !isLoading && !isDHLDataLoading && !isCheckingDHL,
    isDHLEmployee: isDHLUser,
    hasAssignment: !!userAssignment,
    isLoading: isLoading || isDHLDataLoading || isCheckingDHL
  };
};
