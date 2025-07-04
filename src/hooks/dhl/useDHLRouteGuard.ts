
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { isDHLEmployee, isDHLAdmin } from '@/utils/dhlAuthUtils';
import { useDHLData } from './useDHLData';

export const useDHLRouteGuard = (requiresSetup = false) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { userAssignment, isLoading: isDHLDataLoading } = useDHLData(user?.id);
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

    // If user is not DHL employee, don't redirect (just return)
    if (!isDHLUser) {
      console.log('User is not DHL employee');
      return;
    }

    // If DHL user needs setup and we're requiring setup
    if (requiresSetup && !userAssignment) {
      console.log('DHL user needs setup, staying on setup page');
      return;
    }

    // If user has assignment but is on setup page, redirect to dashboard
    if (!requiresSetup && userAssignment && window.location.pathname === '/dhl-setup') {
      console.log('DHL user already has setup, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }

    // If DHL user doesn't have setup and is not on setup page, redirect to setup
    if (!userAssignment && window.location.pathname !== '/dhl-setup') {
      console.log('DHL user needs setup, redirecting to setup page');
      navigate('/dhl-setup');
      return;
    }
  }, [user, userAssignment, isLoading, isDHLDataLoading, isCheckingDHL, requiresSetup, navigate, isDHLUser]);

  return {
    canAccess: !isLoading && !isDHLDataLoading && !isCheckingDHL,
    isDHLEmployee: isDHLUser,
    hasAssignment: !!userAssignment,
    isLoading: isLoading || isDHLDataLoading || isCheckingDHL
  };
};
