
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { canAccessDHLFeatures } from '@/utils/dhlAuthUtils';

interface DHLRouteGuardOptions {
  requireSetup?: boolean;
  redirectTo?: string;
}

export const useDHLRouteGuard = (requireSetup: boolean = false, options: DHLRouteGuardOptions = {}) => {
  const { user } = useAuth();
  const { userAssignment, isLoading } = useDHLData(user?.id);
  const navigate = useNavigate();
  const [canAccess, setCanAccess] = useState(false);

  const hasDHLAccess = canAccessDHLFeatures(user);
  const hasAssignment = !!userAssignment;

  useEffect(() => {
    if (isLoading) return;

    // Check if user has DHL access
    if (!hasDHLAccess) {
      navigate(options.redirectTo || '/dashboard');
      return;
    }

    // If setup is required, check for assignment
    if (requireSetup && !hasAssignment) {
      navigate('/dhl-setup');
      return;
    }

    setCanAccess(true);
  }, [hasDHLAccess, hasAssignment, requireSetup, isLoading, navigate, options.redirectTo]);

  return {
    canAccess,
    hasAssignment,
    hasDHLAccess,
    isLoading
  };
};
