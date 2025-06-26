
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
 * Check if user has DHL management permissions
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
