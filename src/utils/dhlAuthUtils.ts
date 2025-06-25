import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface DHLAuthState {
  isDHLAdmin: boolean;
  isDHLEmployee: boolean;
  canAccessDHLAdmin: boolean;
  canAccessDHLFeatures: boolean;
  hasAssignment: boolean;
  needsSetup: boolean;
}

/**
 * Check if user is DHL admin
 */
export const isDHLAdmin = (user: User | null): boolean => {
  return user?.email === 'admin_dhl@pendlerapp.com';
};

/**
 * Check if user is DHL employee (enhanced with database check)
 */
export const isDHLEmployee = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  console.log('Checking if user is DHL employee:', user.email);
  
  // Check if user has DHL domain email
  if (user.email?.includes('@dhl.')) {
    console.log('User has DHL domain email');
    return true;
  }
  
  // Check if user redeemed DHL2026 promo code
  try {
    const { data: redemption, error } = await supabase
      .from('promo_code_redemptions')
      .select(`
        id,
        promo_codes!inner(code)
      `)
      .eq('user_id', user.id)
      .eq('promo_codes.code', 'DHL2026')
      .maybeSingle();
    
    if (error) {
      console.error('Error checking DHL promo code redemption:', error);
      return false;
    }
    
    if (redemption) {
      console.log('User redeemed DHL2026 promo code');
      return true;
    }
  } catch (error) {
    console.error('Error checking DHL promo code redemption:', error);
  }
  
  console.log('User is not a DHL employee');
  return false;
};

/**
 * Check if user has DHL assignment
 */
export const hasDHLAssignment = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    console.log('Checking DHL assignment for user:', user.id);
    
    const { data, error } = await supabase
      .from('user_dhl_assignments')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking DHL assignment:', error);
      return false;
    }
    
    const hasAssignment = !!data;
    console.log('User has DHL assignment:', hasAssignment);
    return hasAssignment;
  } catch (error) {
    console.error('Error checking DHL assignment:', error);
    return false;
  }
};

/**
 * Get unified DHL auth state (async version)
 */
export const getDHLAuthState = async (user: User | null): Promise<DHLAuthState> => {
  console.log('Getting DHL auth state for user:', user?.email);
  
  const isAdmin = isDHLAdmin(user);
  const isEmployee = await isDHLEmployee(user);
  const hasAssignment = isEmployee ? await hasDHLAssignment(user) : false;

  const authState = {
    isDHLAdmin: isAdmin,
    isDHLEmployee: isEmployee,
    canAccessDHLAdmin: isAdmin,
    canAccessDHLFeatures: isAdmin || (isEmployee && hasAssignment),
    hasAssignment,
    needsSetup: isEmployee && !hasAssignment
  };

  console.log('DHL auth state result:', authState);
  return authState;
};

/**
 * Synchronous version for compatibility (basic checks only)
 */
export const getDHLAuthStateSync = (user: User | null): Omit<DHLAuthState, 'hasAssignment' | 'needsSetup'> => {
  const isAdmin = isDHLAdmin(user);
  const isEmployeeByEmail = user?.email?.includes('@dhl.') || false;

  return {
    isDHLAdmin: isAdmin,
    isDHLEmployee: isEmployeeByEmail,
    canAccessDHLAdmin: isAdmin,
    canAccessDHLFeatures: isAdmin || isEmployeeByEmail
  };
};

/**
 * Check if user can access DHL admin panel
 */
export const canAccessDHLAdmin = (user: User | null): boolean => {
  return isDHLAdmin(user);
};

/**
 * Check if user can access DHL features (sync version)
 */
export const canAccessDHLFeatures = (user: User | null): boolean => {
  const authState = getDHLAuthStateSync(user);
  return authState.canAccessDHLFeatures;
};

/**
 * Get DHL redirect path based on user state
 */
export const getDHLRedirectPath = async (user: User | null): Promise<string | null> => {
  if (!user) return null;
  
  if (isDHLAdmin(user)) {
    return '/dhl-admin';
  }
  
  const authState = await getDHLAuthState(user);
  
  if (authState.needsSetup) {
    return '/dhl-setup';
  }
  
  if (authState.isDHLEmployee && authState.hasAssignment) {
    return '/dhl-dashboard';
  }
  
  return null;
};

/**
 * Create DHL assignment for user
 */
export const createDHLAssignment = async (
  userId: string, 
  positionId: string, 
  workGroupId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('user_dhl_assignments')
      .insert({
        user_id: userId,
        dhl_position_id: positionId,
        dhl_work_group_id: workGroupId,
        is_active: true
      });

    if (error) {
      console.error('Error creating DHL assignment:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating DHL assignment:', error);
    return { success: false, error: 'Neočekávaná chyba při vytváření přiřazení' };
  }
};
