
import { User } from '@supabase/supabase-js';
import { getDHLAuthState, isDHLAdmin, canAccessDHLAdmin, DHLAuthState } from './dhlAuthUtils';

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
 * Utility funkce pro standardizovaný auth state
 */
export const getUnifiedAuthState = (
  user: User | null,
  isAdmin: boolean,
  isPremium: boolean,
  isLoading: boolean
): UnifiedAuthState => {
  const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'admin_dhl@pendlerapp.com'];
  const isSpecialUser = user?.email ? specialEmails.includes(user.email) : false;
  
  // Get DHL auth state
  const dhlAuthState = getDHLAuthState(user);
  const isDHLAdminUser = isDHLAdmin(user);

  return {
    user,
    isAdmin: isAdmin || isSpecialUser || isDHLAdminUser,
    isPremium: isPremium || isSpecialUser,
    isSpecialUser,
    isLoading,
    // DHL states
    isDHLAdmin: isDHLAdminUser,
    isDHLEmployee: dhlAuthState.isDHLEmployee,
    canAccessDHLAdmin: canAccessDHLAdmin(user),
    canAccessDHLFeatures: dhlAuthState.canAccessDHLFeatures
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
export const canAccessDHLAdminFeatures = (authState: UnifiedAuthState): boolean => {
  return authState.canAccessDHLAdmin;
};

/**
 * Check if user can access DHL features
 */
export const canAccessDHLFeatures = (authState: UnifiedAuthState): boolean => {
  return authState.canAccessDHLFeatures;
};
