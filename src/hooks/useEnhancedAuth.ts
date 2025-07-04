
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { isDHLEmployeeSync, getDHLSetupPathSync } from '@/utils/dhlAuthUtils';
import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced auth hook that handles DHL user redirection
 */
export const useEnhancedAuth = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { userAssignment, isLoading: isDHLDataLoading } = useDHLData(user?.id);
  const [profileData, setProfileData] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Load user profile data to check DHL employee status
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) {
        setIsProfileLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_dhl_employee')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile data:', error);
        } else {
          setProfileData(data);
          // Update user metadata with profile data for sync functions
          if (data?.is_dhl_employee && user.user_metadata) {
            user.user_metadata.is_dhl_employee = data.is_dhl_employee;
          }
        }
      } catch (error) {
        console.error('Error in loadProfileData:', error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadProfileData();
  }, [user?.id]);

  // Handle DHL user redirection
  useEffect(() => {
    if (isLoading || isDHLDataLoading || isProfileLoading) return;
    if (!user) return;

    // Skip redirection if already on DHL setup page
    if (location.pathname === '/dhl-setup') return;

    // Check if user is DHL employee
    const isDHLUser = isDHLEmployeeSync(user);
    
    console.log('Enhanced Auth Check:', {
      isDHLUser,
      hasAssignment: !!userAssignment,
      currentPath: location.pathname,
      profileData
    });

    // If DHL user without assignment, redirect to setup
    if (isDHLUser && !userAssignment) {
      console.log('Redirecting DHL user to setup page');
      navigate('/dhl-setup');
    }
  }, [
    user, 
    userAssignment, 
    isLoading, 
    isDHLDataLoading, 
    isProfileLoading,
    location.pathname, 
    navigate,
    profileData
  ]);

  return {
    user,
    userAssignment,
    isLoading: isLoading || isDHLDataLoading || isProfileLoading,
    isDHLEmployee: user ? isDHLEmployeeSync(user) : false,
    profileData
  };
};
