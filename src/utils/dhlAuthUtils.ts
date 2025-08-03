import { supabase } from '@/integrations/supabase/client';

export interface DHLAuthState {
  isDHLEmployee: boolean;
  company: string | null;
  isAdmin: boolean;
  canAccessDHLFeatures: boolean;
}

/**
 * Check if a user is a DHL employee based on their profile
 */
export const isDHLEmployee = async (userIdOrUser: string | any): Promise<boolean> => {
  const userId = typeof userIdOrUser === 'string' ? userIdOrUser : userIdOrUser?.id;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_dhl_employee, company')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.is_dhl_employee || data.company === 'dhl';
  } catch (error) {
    console.error('Error checking DHL employee status:', error);
    return false;
  }
};

/**
 * Synchronous version - checks user object directly
 */
export const isDHLEmployeeSync = (user: any): boolean => {
  if (!user?.id) return false;
  // This would need to be based on cached data or user metadata
  return user.user_metadata?.company === 'dhl' || false;
};

/**
 * Check if user is DHL admin
 */
export const isDHLAdmin = (userIdOrUser: string | any): boolean | Promise<boolean> => {
  const userId = typeof userIdOrUser === 'string' ? userIdOrUser : userIdOrUser?.id;
  if (!userId) return false;
  
  return checkDHLAdminAsync(userId);
};

const checkDHLAdminAsync = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_permissions')
      .select('permission_level')
      .eq('user_id', userId)
      .eq('is_active', true)
      .in('permission_level', ['dhl_admin', 'super_admin'])
      .maybeSingle();

    return !error && !!data;
  } catch (error) {
    console.error('Error checking DHL admin status:', error);
    return false;
  }
};

/**
 * Check if user is regular admin
 */
export const isRegularAdmin = (userIdOrUser: string | any): boolean | Promise<boolean> => {
  const userId = typeof userIdOrUser === 'string' ? userIdOrUser : userIdOrUser?.id;
  if (!userId) return false;
  
  return checkRegularAdminAsync(userId);
};

const checkRegularAdminAsync = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    return !error && !!data?.is_admin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Check if user can access DHL admin features (synchronous version)
 */
export const canAccessDHLAdminSync = (user: any): boolean => {
  if (!user?.email) return false;
  
  // DHL admin email has access
  if (user.email === 'admin_dhl@pendlerapp.com') return true;
  
  // Main admin email has access  
  if (user.email === 'admin@pendlerapp.com') return true;
  
  // Special users have access
  const specialEmails = ['uzivatel@pendlerapp.com', 'zkouska@gmail.com'];
  if (specialEmails.includes(user.email)) return true;
  
  return false;
};

/**
 * Check if user can access DHL admin features (async version)
 */
export const canAccessDHLAdmin = (userIdOrUser: string | any): boolean | Promise<boolean> => {
  const userId = typeof userIdOrUser === 'string' ? userIdOrUser : userIdOrUser?.id;
  if (!userId) return false;
  
  // For user objects, try sync first
  if (typeof userIdOrUser === 'object' && userIdOrUser?.email) {
    const syncResult = canAccessDHLAdminSync(userIdOrUser);
    if (syncResult) return true;
  }
  
  return checkCanAccessDHLAdminAsync(userId);
};

const checkCanAccessDHLAdminAsync = async (userId: string): Promise<boolean> => {
  const [isDHLAdminUser, isRegularAdminUser] = await Promise.all([
    checkDHLAdminAsync(userId),
    checkRegularAdminAsync(userId)
  ]);
  return isDHLAdminUser || isRegularAdminUser;
};

/**
 * Check if user can access DHL features
 */
export const canAccessDHLFeatures = (userIdOrUser: string | any): boolean | Promise<boolean> => {
  const userId = typeof userIdOrUser === 'string' ? userIdOrUser : userIdOrUser?.id;
  if (!userId) return false;
  
  return isDHLEmployee(userId);
};

/**
 * Get DHL auth state synchronously
 */
export const getDHLAuthStateSync = (user: any): DHLAuthState => {
  return {
    isDHLEmployee: isDHLEmployeeSync(user),
    company: user?.user_metadata?.company || null,
    isAdmin: user?.user_metadata?.is_admin || false,
    canAccessDHLFeatures: isDHLEmployeeSync(user)
  };
};

/**
 * Check if a promo code is a DHL promo code (legacy function for compatibility)
 */
export const isDHLPromoCode = (code: string): boolean => {
  // This is now mainly for legacy compatibility
  // DHL status is determined by company premium codes
  const dhlCodes = ['DHL2026', 'DHL2025', 'DHLSPECIAL'];
  return dhlCodes.includes(code.toUpperCase());
};

/**
 * Get DHL-specific user data
 */
export const getDHLUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_dhl_employee, company')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { isDHL: false, company: null };
    }

    return {
      isDHL: data.is_dhl_employee || data.company === 'dhl',
      company: data.company
    };
  } catch (error) {
    console.error('Error getting DHL user data:', error);
    return { isDHL: false, company: null };
  }
};