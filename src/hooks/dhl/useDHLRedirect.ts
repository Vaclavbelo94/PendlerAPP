
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';
import { useDHLData } from './useDHLData';

export const useDHLRedirect = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { userAssignment, isLoading: dhlDataLoading } = useDHLData(user?.id || null);

  useEffect(() => {
    // Wait for both auth and DHL data to load
    if (authLoading || dhlDataLoading) return;

    // Only check for DHL employees
    if (!user || !isDHLEmployee(user)) return;

    // Skip if already on DHL setup page
    if (location.pathname === '/dhl-setup') return;

    // If DHL user doesn't have assignment, redirect to setup
    if (!userAssignment) {
      console.log('DHL user without assignment, redirecting to setup');
      navigate('/dhl-setup');
      return;
    }

    // If user is on setup page but already has assignment, redirect to dashboard
    if (location.pathname === '/dhl-setup' && userAssignment) {
      console.log('DHL user already has assignment, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
  }, [user, userAssignment, authLoading, dhlDataLoading, location.pathname, navigate]);

  return {
    isDHLUser: isDHLEmployee(user),
    hasAssignment: !!userAssignment,
    isLoading: authLoading || dhlDataLoading
  };
};
