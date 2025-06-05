
import { User } from '@supabase/supabase-js';

export interface UnifiedAuthState {
  user: User | null;
  isAdmin: boolean;
  isPremium: boolean;
  isSpecialUser: boolean;
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
