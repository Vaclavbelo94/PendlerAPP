
import { User } from '@supabase/supabase-js';
import { getDHLAuthState, DHLAuthState } from './dhlAuthUtils';

export interface UnifiedAuthState {
  user: User | null;
  isAdmin: boolean;
  isPremium: boolean;
  isSpecialUser: boolean;
  isLoading: boolean;
  // DHL specific states
  isDHLAdmin: boolean;
  isDHLEmployee: boolean;
  canAccessDHLAdmin: boolean;
  canAccessDHLFeatures: boolean;
}

/**
 * Utility funkce pro standardizovaný auth state (async version)
 */
export const getUnifiedAuthState = async (
  user: User | null,
  isAdmin: boolean,
  isPremium: boolean,
  isLoading: boolean
): Promise<UnifiedAuthState> => {
  const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'admin_dhl@pendlerapp.com'];
  const isSpecialUser = user?.email ? specialEmails.includes(user.email) : false;
  
  // Get DHL auth state (now properly awaited)
  const dhlAuthState = await getDHLAuthState(user);

  return {
    user,
    isAdmin: isAdmin || isSpecialUser || dhlAuthState.isDHLAdmin,
    isPremium: isPremium || isSpecialUser,
    isSpecialUser,
    isLoading,
    // DHL states
    isDHLAdmin: dhlAuthState.isDHLAdmin,
    isDHLEmployee: dhlAuthState.isDHLEmployee,
    canAccessDHLAdmin: dhlAuthState.canAccessDHLAdmin,
    canAccessDHLFeatures: dhlAuthState.canAccessDHLFeatures
  };
};

/**
 * Synchronous version for compatibility (basic checks only)
 */
export const getUnifiedAuthStateSync = (
  user: User | null,
  isAdmin: boolean,
  isPremium: boolean,
  isLoading: boolean
): Omit<UnifiedAuthState, 'isDHLAdmin' | 'isDHLEmployee' | 'canAccessDHLAdmin' | 'canAccessDHLFeatures'> => {
  const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'admin_dhl@pendlerapp.com'];
  const isSpecialUser = user?.email ? specialEmails.includes(user.email) : false;
  
  return {
    user,
    isAdmin: isAdmin || isSpecialUser,
    isPremium: isPremium || isSpecialUser,
    isSpecialUser,
    isLoading
  };
};

/**
 * Check if user can access admin features
 */
export const canAccessAdmin = (authState: UnifiedAuthState): boolean => {
  return authState.isAdmin || authState.isSpecialUser;
};

/**
 * Check if user can access premium features
 */
export const canAccessPremium = (authState: UnifiedAuthState): boolean => {
  return authState.isPremium || authState.isSpecialUser;
};

/**
 * Check if user can access DHL admin features
 */
export const canAccessDHLAdmin = (authState: UnifiedAuthState): boolean => {
  return authState.canAccessDHLAdmin;
};

/**
 * Check if user can access DHL features
 */
export const canAccessDHLFeatures = (authState: UnifiedAuthState): boolean => {
  return authState.canAccessDHLFeatures;
};
