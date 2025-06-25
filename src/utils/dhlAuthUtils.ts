
import { User } from '@supabase/supabase-js';

export interface DHLAuthState {
  isDHLAdmin: boolean;
  isDHLEmployee: boolean;
  canAccessDHLAdmin: boolean;
  canAccessDHLFeatures: boolean;
}

/**
 * Check if user is DHL admin
 */
export const isDHLAdmin = (user: User | null): boolean => {
  return user?.email === 'admin_dhl@pendlerapp.com';
};

/**
 * Check if user is DHL employee (has DHL assignment)
 */
export const isDHLEmployee = (user: User | null): boolean => {
  // This will be enhanced later with actual DHL assignment check
  return user?.email?.includes('@dhl.') || false;
};

/**
 * Get unified DHL auth state
 */
export const getDHLAuthState = (user: User | null): DHLAuthState => {
  const isAdmin = isDHLAdmin(user);
  const isEmployee = isDHLEmployee(user);

  return {
    isDHLAdmin: isAdmin,
    isDHLEmployee: isEmployee,
    canAccessDHLAdmin: isAdmin,
    canAccessDHLFeatures: isAdmin || isEmployee
  };
};

/**
 * Check if user can access DHL admin panel
 */
export const canAccessDHLAdmin = (user: User | null): boolean => {
  return isDHLAdmin(user);
};

/**
 * Check if user can access DHL features
 */
export const canAccessDHLFeatures = (user: User | null): boolean => {
  const authState = getDHLAuthState(user);
  return authState.canAccessDHLFeatures;
};

/**
 * Get DHL redirect path based on user type
 */
export const getDHLRedirectPath = (user: User | null): string | null => {
  if (isDHLAdmin(user)) {
    return '/dhl-admin';
  }
  if (isDHLEmployee(user)) {
    return '/dhl-dashboard';
  }
  return null;
};
