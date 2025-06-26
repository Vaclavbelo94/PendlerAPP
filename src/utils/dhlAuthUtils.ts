
interface User {
  id?: string;
  email?: string;
  // Add other user properties as needed
}

interface Profile {
  is_admin?: boolean;
  is_premium?: boolean;
  // Add other profile properties as needed
}

export interface DHLAuthState {
  isDHLAdmin: boolean;
  isDHLEmployee: boolean;
  canAccessDHLAdmin: boolean;
  canAccessDHLFeatures: boolean;
}

/**
 * Check if user is DHL employee based on email domain
 */
export const isDHLEmployee = (user: User | null): boolean => {
  if (!user?.email) return false;
  
  // Check for DHL email domains
  const dhlDomains = ['@dhl.com', '@dhl.de', '@dhl.cz'];
  const email = user.email.toLowerCase();
  
  // Also include specific test emails
  const testEmails = ['admin_dhl@pendlerapp.com', 'vaclavbelo94@gmail.com'];
  
  return dhlDomains.some(domain => email.includes(domain)) || testEmails.includes(email);
};

/**
 * Check if user is DHL admin
 */
export const isDHLAdmin = (user: User | null): boolean => {
  if (!user?.email) return false;
  
  // DHL admin emails
  const adminEmails = ['admin_dhl@pendlerapp.com', 'vaclavbelo94@gmail.com'];
  return adminEmails.includes(user.email);
};

/**
 * Check if user can access DHL features
 * For now, we'll allow all authenticated users
 * In production, this would check for specific DHL employee status
 */
export const canAccessDHLFeatures = (user: User | null): boolean => {
  if (!user) return false;
  
  // For demo purposes, allow all authenticated users
  // In production, you would check against a DHL employee database or specific user roles
  return true;
};

/**
 * Check if user can access DHL admin features
 */
export const canAccessDHLAdmin = (user: User | null): boolean => {
  if (!user) return false;
  
  // This would typically check for admin role
  // For now, we'll use email-based check (replace with proper role checking)
  return user.email === 'vaclavbelo94@gmail.com';
};

/**
 * Check if user can access DHL management permissions
 */
export const canManageDHLUsers = (user: User | null): boolean => {
  return canAccessDHLAdmin(user);
};

/**
 * Check if user can generate DHL shifts
 */
export const canGenerateDHLShifts = (user: User | null): boolean => {
  return canAccessDHLAdmin(user);
};

/**
 * Get comprehensive DHL auth state for a user
 */
export const getDHLAuthState = (user: User | null): DHLAuthState => {
  return {
    isDHLAdmin: isDHLAdmin(user),
    isDHLEmployee: isDHLEmployee(user),
    canAccessDHLAdmin: canAccessDHLAdmin(user),
    canAccessDHLFeatures: canAccessDHLFeatures(user)
  };
};

/**
 * Get DHL redirect path based on user status
 */
export const getDHLRedirectPath = (user: User | null): string | null => {
  if (!user) return null;
  
  const isDHL = isDHLEmployee(user);
  const isAdmin = isDHLAdmin(user);
  
  if (!isDHL) return null;
  
  if (isAdmin) {
    return '/dhl-admin';
  } else {
    return '/dhl-dashboard';
  }
};
