
/**
 * DHL Authentication utilities
 * Functions to check DHL employee status and permissions
 */

export interface DHLUser {
  id: string;
  email?: string;
  user_metadata?: {
    company?: string;
    department?: string;
    role?: string;
  };
}

/**
 * Check if user is a DHL employee
 * For demo purposes, we'll check if user email contains 'dhl' or has DHL in metadata
 */
export const isDHLEmployee = (user: DHLUser): boolean => {
  if (!user) return false;
  
  const email = user.email?.toLowerCase();
  const company = user.user_metadata?.company?.toLowerCase();
  
  // Check if email contains DHL domain or company metadata indicates DHL
  return (
    (email && email.includes('dhl')) ||
    (company && company.includes('dhl')) ||
    false
  );
};

/**
 * Check if user can access DHL admin features
 */
export const canAccessDHLAdmin = (user: DHLUser): boolean => {
  if (!isDHLEmployee(user)) return false;
  
  const role = user.user_metadata?.role?.toLowerCase();
  
  // Only specific roles can access admin features
  return (
    role === 'admin' ||
    role === 'supervisor' ||
    role === 'manager' ||
    false
  );
};

/**
 * Get DHL user permissions
 */
export const getDHLPermissions = (user: DHLUser) => {
  const isEmployee = isDHLEmployee(user);
  const canAdmin = canAccessDHLAdmin(user);
  
  return {
    isEmployee,
    canAdmin,
    canViewTimes: isEmployee,
    canEditTimes: canAdmin,
    canImportSchedules: canAdmin,
    canBulkOperations: canAdmin
  };
};
