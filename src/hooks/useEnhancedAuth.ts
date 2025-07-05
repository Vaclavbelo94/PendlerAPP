
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDHLData } from '@/hooks/dhl/useDHLData';
import { isDHLEmployee, isDHLEmployeeSync, getDHLSetupPathSync } from '@/utils/dhlAuthUtils';
import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced auth hook that handles DHL user redirection and profile loading
 */
export const useEnhancedAuth = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { userAssignment, isLoading: isDHLDataLoading } = useDHLData(user?.id);
  const [profileData, setProfileData] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isDHLEmployee, setIsDHLEmployee] = useState<boolean>(false);
  const [isDHLCheckComplete, setIsDHLCheckComplete] = useState(false);

  // Load user profile data and check DHL employee status
  useEffect(() => {
    const loadProfileAndCheckDHL = async () => {
      if (!user?.id) {
        setIsProfileLoading(false);
        setIsDHLCheckComplete(true);
        return;
      }

      try {
        console.log('Enhanced Auth: Loading profile and checking DHL status for user:', user.email);
        
        // Load profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('is_dhl_employee')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile data:', error);
        } else if (data) {
          setProfileData(data);
          
          // Update user metadata with profile data for sync functions
          if (data.is_dhl_employee && user.user_metadata) {
            user.user_metadata.is_dhl_employee = data.is_dhl_employee;
          }
        }

        // Perform comprehensive DHL check (async)
        const dhlStatus = await isDHLEmployee(user);
        setIsDHLEmployee(dhlStatus);
        
        console.log('Enhanced Auth: DHL check complete', {
          userId: user.id,
          email: user.email,
          profileFlag: data?.is_dhl_employee,
          finalDHLStatus: dhlStatus
        });

      } catch (error) {
        console.error('Error in loadProfileAndCheckDHL:', error);
      } finally {
        setIsProfileLoading(false);
        setIsDHLCheckComplete(true);
      }
    };

    loadProfileAndCheckDHL();
  }, [user?.id]);

  // Handle DHL user redirection
  useEffect(() => {
    if (isLoading || isDHLDataLoading || isProfileLoading || !isDHLCheckComplete) {
      console.log('Enhanced Auth: Waiting for data to load...');
      return;
    }
    
    if (!user) return;

    // Skip redirection if already on DHL setup page
    if (location.pathname === '/dhl-setup') return;

    console.log('Enhanced Auth Check:', {
      isDHLEmployee,
      hasAssignment: !!userAssignment,
      currentPath: location.pathname,
      profileData
    });

    // If DHL user without assignment, redirect to setup
    if (isDHLEmployee && !userAssignment) {
      console.log('Redirecting DHL user to setup page');
      navigate('/dhl-setup');
    }
  }, [
    user, 
    userAssignment, 
    isLoading, 
    isDHLDataLoading, 
    isProfileLoading,
    isDHLCheckComplete,
    isDHLEmployee,
    location.pathname, 
    navigate,
    profileData
  ]);

  return {
    user,
    userAssignment,
    isLoading: isLoading || isDHLDataLoading || isProfileLoading || !isDHLCheckComplete,
    isDHLEmployee,
    profileData,
    // Sync version for immediate use in components
    isDHLEmployeeSync: user ? isDHLEmployeeSync(user) : false
  };
};
