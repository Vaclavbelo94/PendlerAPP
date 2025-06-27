
import { User } from '@supabase/supabase-js';

export interface DHLAuthState {
  isDHLEmployee: boolean;
  hasAssignment: boolean;
  canAccessDHLFeatures: boolean;
}

/**
 * Check if user is DHL employee (has used DHL2026 promo code or has DHL assignment)
 */
export const isDHLEmployee = (user: User | null): boolean => {
  if (!user?.email) {
    console.log('DHL Employee check: No email provided');
    return false;
  }
  
  // Support various DHL email formats and admin
  const dhlEmailPatterns = [
    '@dhl.com',        // Standard DHL email (this will match moment@dhl.com)
    '@dhl.de',         // German DHL
    'test@dhl.com',    // Test account
    'admindhl@pendlerapp.com' // DHL admin - UPDATED
  ];
  
  const isDHLEmp = dhlEmailPatterns.some(pattern => {
    if (pattern.startsWith('@')) {
      return user.email!.endsWith(pattern); // Changed from includes to endsWith for proper domain matching
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
 * Check if user is DHL admin
 */
export const isDHLAdmin = (user: User | null): boolean => {
  const isAdmin = user?.email === 'admindhl@pendlerapp.com'; // UPDATED
  console.log('DHL Admin check:', { email: user?.email, isAdmin });
  return isAdmin;
};

/**
 * Check if user is regular admin
 */
export const isRegularAdmin = (user: User | null): boolean => {
  const isAdmin = user?.email === 'admin@pendlerapp.com';
  console.log('Regular Admin check:', { email: user?.email, isAdmin });
  return isAdmin;
};

/**
 * Get unified DHL auth state
 */
export const getDHLAuthState = (user: User | null): DHLAuthState => {
  const isEmployee = isDHLEmployee(user);

  const authState = {
    isDHLEmployee: isEmployee,
    hasAssignment: false, // Will be checked in components via useDHLData
    canAccessDHLFeatures: isEmployee
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
 * Check if user can access DHL features (unified approach)
 */
export const canAccessDHLFeatures = (user: User | null): boolean => {
  return isDHLEmployee(user);
};

/**
 * Get DHL setup redirect path if needed
 */
export const getDHLSetupPath = (user: User | null, hasAssignment: boolean): string | null => {
  if (isDHLEmployee(user) && !hasAssignment) {
    return '/dhl-setup';
  }
  return null;
};

/**
 * Get DHL redirect path for login/register
 */
export const getDHLRedirectPath = (user: User | null): string | null => {
  if (isDHLEmployee(user)) {
    // Check if user needs setup (this will be determined by checking assignment in component)
    return null; // Let the component handle the redirect logic
  }
  return null;
};

/**
 * Get admin redirect path based on user type
 */
export const getAdminRedirectPath = (user: User | null): string | null => {
  if (isDHLAdmin(user)) {
    return '/DHLAdmin';
  }
  if (isRegularAdmin(user)) {
    return '/admin';
  }
  return null;
};

/**
 * Check if promo code is DHL related
 */
export const isDHLPromoCode = (promoCode: string): boolean => {
  const dhlPromoCodes = ['DHL2026', 'DHL2025', 'DHLSPECIAL'];
  return dhlPromoCodes.includes(promoCode.toUpperCase());
};
