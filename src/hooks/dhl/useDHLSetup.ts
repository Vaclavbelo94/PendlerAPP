import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { isDHLEmployee } from '@/utils/dhlAuthUtils';

interface DHLSetupData {
  personalNumber?: string;
  positionId: string;
  currentWoche: number; // User's current Woche (1-15)
}

interface DHLSetupState {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isSetupComplete: boolean;
  canAccess: boolean;
}

export const useDHLSetup = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DHLSetupState>({
    isLoading: true,
    isSubmitting: false,
    error: null,
    isSetupComplete: false,
    canAccess: false,
  });

  // Check if user already has DHL setup
  useEffect(() => {
    const checkSetupStatus = async () => {
      if (!user) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          canAccess: false,
          error: 'No user'
        }));
        return;
      }

      // Check DHL employee status (async)
      const isDHL = await isDHLEmployee(user);
      
      if (!isDHL) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          canAccess: false,
          error: 'Unauthorized access'
        }));
        return;
      }

      try {
        console.log('Checking DHL setup status for user:', user.id);
        
        // Check for assignment - the database trigger handles duplicates automatically
        const { data, error } = await supabase
          .from('user_dhl_assignments')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          throw error;
        }

        console.log('DHL assignment check result:', data);

        setState(prev => ({
          ...prev,
          isLoading: false,
          canAccess: true,
          isSetupComplete: !!data,
          error: null
        }));
      } catch (error) {
        console.error('Error checking DHL setup status:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          canAccess: true,
          error: 'Error checking setup status',
        }));
      }
    };

    checkSetupStatus();
  }, [user]);

  const submitSetup = async (setupData: DHLSetupData): Promise<boolean> => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'No user' }));
      return false;
    }

    // Check DHL employee status (async)
    const isDHL = await isDHLEmployee(user);
    if (!isDHL) {
      setState(prev => ({ ...prev, error: 'Unauthorized access' }));
      return false;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      console.log('=== SUBMITTING DHL SETUP ===');
      console.log('User ID:', user.id);
      console.log('Setup Data:', setupData);

      // Create new DHL assignment - the database trigger will handle deactivating old ones
      const assignmentData = {
        user_id: user.id,
        dhl_position_id: setupData.positionId,
        dhl_work_group_id: null, // Always null for individual assignments with annual plans
        assigned_at: new Date().toISOString(),
        current_woche: setupData.currentWoche, // User's current Woche (1-15) for this calendar week
        is_active: true
      };

      const { data: assignment, error: assignmentError } = await supabase
        .from('user_dhl_assignments')
        .insert(assignmentData)
        .select()
        .single();

      if (assignmentError) {
        console.error('Assignment creation error:', assignmentError);
        throw new Error('Failed to create DHL assignment');
      }

      console.log('DHL assignment created:', assignment);

      // Update personal number in profile if provided
      if (setupData.personalNumber && setupData.personalNumber.trim()) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            personal_number: setupData.personalNumber.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) {
          console.warn('Could not update personal number:', profileError);
          // Non-critical, continue
        }
      }

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isSetupComplete: true,
      }));

      console.log('DHL setup completed successfully');
      return true;

    } catch (error: any) {
      console.error('Error submitting DHL setup:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error.message || 'Setup submission failed',
      }));
      return false;
    }
  };

  return {
    ...state,
    submitSetup,
  };
};