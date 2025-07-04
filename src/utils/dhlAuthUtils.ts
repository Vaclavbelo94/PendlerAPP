
import { User } from '@supabase/supabase-js';
import { hasDHLPromoCode } from './dhlPromoUtils';

export interface DHLAuthState {
  isDHLEmployee: boolean;
  hasAssignment: boolean;
  canAccessDHLFeatures: boolean;
}

/**
 * Check if user is DHL employee (has used DHL2026 promo code or other DHL codes)
 */
export const isDHLEmployee = async (user: User | null): Promise<boolean> => {
  if (!user?.id) {
    console.log('DHL Employee check: No user ID provided');
    return false;
  }
  
  // Check if user has redeemed DHL promo code
  const hasDHLPromo = await hasDHLPromoCode(user.id);
  
  console.log('DHL Employee check:', { 
    userId: user.id,
    email: user.email, 
    hasDHLPromo
  });
  
  return hasDHLPromo;
};

/**
 * Synchronous version for compatibility (checks email patterns only)
 */
export const isDHLEmployeeSync = (user: User | null): boolean => {
  if (!user?.email) {
    console.log('DHL Employee sync check: No email provided');
    return false;
  }
  
  // Support various DHL email formats and admin
  const dhlEmailPatterns = [
    '@dhl.com',
    '@dhl.de',
    'test@dhl.com',
    'admindhl@pendlerapp.com'
  ];
  
  const isDHLEmp = dhlEmailPatterns.some(pattern => {
    if (pattern.startsWith('@')) {
      return user.email!.endsWith(pattern);
    } else {
      return user.email === pattern;
    }
  });
  
  console.log('DHL Employee sync check:', { 
    email: user.email, 
    isDHLEmployee: isDHLEmp
  });
  
  return isDHLEmp;
};

/**
 * Check if user is DHL admin
 */
export const isDHLAdmin = (user: User | null): boolean => {
  const isAdmin = user?.email === 'admindhl@pendlerapp.com';
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
 * Get unified DHL auth state (async version)
 */
export const getDHLAuthState = async (user: User | null): Promise<DHLAuthState> => {
  const isEmployee = await isDHLEmployee(user);

  const authState = {
    isDHLEmployee: isEmployee,
    hasAssignment: false, // Will be checked in components via useDHLData
    canAccessDHLFeatures: isEmployee
  };

  console.log('DHL Auth State:', authState);
  return authState;
};

/**
 * Synchronous version for compatibility
 */
export const getDHLAuthStateSync = (user: User | null): DHLAuthState => {
  const isEmployee = isDHLEmployeeSync(user);

  const authState = {
    isDHLEmployee: isEmployee,
    hasAssignment: false,
    canAccessDHLFeatures: isEmployee
  };

  console.log('DHL Auth State (sync):', authState);
  return authState;
};

/**
 * Check if user can access DHL admin panel
 */
export const canAccessDHLAdmin = (user: User | null): boolean => {
  return isDHLAdmin(user);
};

/**
 * Check if user can access DHL features (sync version for compatibility)
 */
export const canAccessDHLFeatures = (user: User | null): boolean => {
  return isDHLEmployeeSync(user);
};

/**
 * Check if user can access DHL features (async version)
 */
export const canAccessDHLFeaturesAsync = async (user: User | null): Promise<boolean> => {
  return await isDHLEmployee(user);
};

/**
 * Get DHL setup redirect path if needed (async version)
 */
export const getDHLSetupPath = async (user: User | null, hasAssignment: boolean): Promise<string | null> => {
  const isDHL = await isDHLEmployee(user);
  if (isDHL && !hasAssignment) {
    return '/dhl-setup';
  }
  return null;
};

/**
 * Get DHL setup redirect path if needed (sync version)
 */
export const getDHLSetupPathSync = (user: User | null, hasAssignment: boolean): string | null => {
  const isDHL = isDHLEmployeeSync(user);
  if (isDHL && !hasAssignment) {
    return '/dhl-setup';
  }
  return null;
};

/**
 * Get DHL redirect path for login/register
 */
export const getDHLRedirectPath = async (user: User | null): Promise<string | null> => {
  const isDHL = await isDHLEmployee(user);
  if (isDHL) {
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
