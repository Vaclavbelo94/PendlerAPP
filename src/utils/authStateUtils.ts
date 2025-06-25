
import { User } from '@supabase/supabase-js';

export interface UnifiedAuthState {
  user: User | null;
  isAdmin: boolean;
  isPremium: boolean;
  isSpecialUser: boolean;
  isDHLAdmin: boolean;
  isLoading: boolean;
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
  const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com'];
  const dhlAdminEmails = ['admin_dhl@pendlerapp.com'];
  const allAdminEmails = [...specialEmails, ...dhlAdminEmails];
  
  const isSpecialUser = user?.email ? specialEmails.includes(user.email) : false;
  const isDHLAdmin = user?.email ? dhlAdminEmails.includes(user.email) : false;
  const isAdminByEmail = user?.email ? allAdminEmails.includes(user.email) : false;

  return {
    user,
    isAdmin: isAdmin || isAdminByEmail,
    isPremium: isPremium || isAdminByEmail,
    isSpecialUser,
    isDHLAdmin,
    isLoading
  };
};

/**
 * Check if user can access admin features
 */
export const canAccessAdmin = (authState: UnifiedAuthState): boolean => {
  return authState.isAdmin || authState.isSpecialUser || authState.isDHLAdmin;
};

/**
 * Check if user can access premium features
 */
export const canAccessPremium = (authState: UnifiedAuthState): boolean => {
  return authState.isPremium || authState.isSpecialUser || authState.isDHLAdmin;
};

/**
 * Check if user can access DHL admin features
 */
export const canAccessDHLAdmin = (authState: UnifiedAuthState): boolean => {
  return authState.isDHLAdmin || authState.isAdmin || authState.isSpecialUser;
};
