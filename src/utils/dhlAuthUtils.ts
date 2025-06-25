
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
  const isAdmin = user?.email === 'admin_dhl@pendlerapp.com';
  console.log('DHL Admin check:', { email: user?.email, isAdmin });
  return isAdmin;
};

/**
 * Check if user is DHL employee (has DHL assignment)
 */
export const isDHLEmployee = (user: User | null): boolean => {
  if (!user?.email) {
    console.log('DHL Employee check: No email provided');
    return false;
  }
  
  // Support various DHL email formats
  const dhlEmailPatterns = [
    '@dhl.com',        // Standard DHL email
    '@dhl.de',         // German DHL
    'test@dhl.com',    // Test account
    'admin_dhl@pendlerapp.com' // DHL admin
  ];
  
  const isDHLEmp = dhlEmailPatterns.some(pattern => {
    if (pattern.startsWith('@')) {
      return user.email!.includes(pattern);
    } else {
      return user.email === pattern;
    }
  });
  
  console.log('DHL Employee check:', { 
    email: user.email, 
    isDHLEmployee: isDHLEmp,
    checkedPatterns: dhlEmailPatterns 
  });
  
  return isDHLEmp;
};

/**
 * Get unified DHL auth state
 */
export const getDHLAuthState = (user: User | null): DHLAuthState => {
  const isAdmin = isDHLAdmin(user);
  const isEmployee = isDHLEmployee(user);

  const authState = {
    isDHLAdmin: isAdmin,
    isDHLEmployee: isEmployee,
    canAccessDHLAdmin: isAdmin,
    canAccessDHLFeatures: isAdmin || isEmployee
  };

  console.log('DHL Auth State:', authState);
  return authState;
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
