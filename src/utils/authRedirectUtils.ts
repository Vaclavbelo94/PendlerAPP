import { User } from '@supabase/supabase-js';

/**
 * Utility for determining correct redirect paths based on user type
 */

export const isDHLAdminSync = (user: User | null): boolean => {
  if (!user?.email) return false;
  return user.email === 'admin_dhl@pendlerapp.com';
};

export const isMainAdminSync = (user: User | null): boolean => {
  if (!user?.email) return false;
  return user.email === 'admin@pendlerapp.com';
};

export const isSpecialUserSync = (user: User | null): boolean => {
  if (!user?.email) return false;
  const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'admin_dhl@pendlerapp.com', 'zkouska@gmail.com'];
  return specialEmails.includes(user.email);
};

/**
 * Get correct admin redirect path based on user email
 */
export const getAdminRedirectPath = (user: User | null): string | null => {
  if (!user?.email) return null;
  
  // DHL admin goes to DHL panel
  if (isDHLAdminSync(user)) {
    return '/dhl-admin';
  }
  
  // Main admin goes to mobile admin panel
  if (isMainAdminSync(user)) {
    return '/admin/mobile';
  }
  
  // Other special users go to main admin panel
  if (isSpecialUserSync(user)) {
    return '/admin/v2';
  }
  
  return null;
};

/**
 * Check if user should be redirected away from current admin panel
 */
export const shouldRedirectFromAdminPanel = (user: User | null, currentPath: string): string | null => {
  const correctPath = getAdminRedirectPath(user);
  
  if (!correctPath) return null;
  
  // If user is on wrong admin panel, redirect to correct one
  if (currentPath === '/admin' && correctPath !== '/admin/v2') {
    return correctPath;
  }
  
  if (currentPath === '/dhl-admin' && correctPath !== '/dhl-admin') {
    return correctPath;
  }
  
  return null;
};
