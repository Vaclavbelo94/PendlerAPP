
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { DHLService } from '@/services/dhlService';
import DHLDashboard from '@/components/dhl/DHLDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';

const DHLDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { userAssignment, isLoading: dhlLoading } = useDHLData(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (!dhlLoading && user && !userAssignment?.is_active) {
      // Check if user should be redirected to DHL setup
      DHLService.shouldRedirectToDHLSetup(user.id).then((shouldRedirect) => {
        if (shouldRedirect) {
          navigate('/dhl-setup');
        } else {
          // User doesn't have DHL access, redirect to dashboard
          navigate('/dashboard');
        }
      });
    }
  }, [user, userAssignment, authLoading, dhlLoading, navigate]);

  if (authLoading || dhlLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  if (!userAssignment?.is_active) {
    return null; // Will redirect in useEffect
  }

  return <DHLDashboard />;
};

export default DHLDashboardPage;
