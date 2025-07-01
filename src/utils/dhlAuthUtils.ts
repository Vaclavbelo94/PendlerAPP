
// Utility functions for DHL authentication checks

export const isDHLEmployee = (user: any): boolean => {
  if (!user) return false;
  
  // Check if user has DHL-specific properties (set during registration with DHL promo code)
  if (user.isDHLEmployee || user.isDHLUser) {
    return true;
  }
  
  // Check user metadata for DHL flag
  if (user.user_metadata?.isDHLUser || user.user_metadata?.isDHLEmployee) {
    return true;
  }
  
  return false;
};

export const checkDHLAccess = (user: any): boolean => {
  return isDHLEmployee(user);
};

export const getDHLUserType = (user: any): 'employee' | 'admin' | 'standard' => {
  if (!user) return 'standard';
  
  if (isDHLEmployee(user)) {
    // Check if user has admin privileges
    if (user.isAdmin || user.is_admin) {
      return 'admin';
    }
    return 'employee';
  }
  
  return 'standard';
};

export const isRegularAdmin = (user: any): boolean => {
  if (!user) return false;
  
  // Check if user is a regular admin (not DHL specific)
  if (user.isAdmin || user.is_admin) {
    return true;
  }
  
  // Check for admin email patterns
  if (user.email && typeof user.email === 'string') {
    const adminEmails = ['admin@pendlerapp.com'];
    return adminEmails.includes(user.email.toLowerCase());
  }
  
  return false;
};

export const isDHLAdmin = (user: any): boolean => {
  if (!user) return false;
  
  // Check if user is DHL admin
  if (isDHLEmployee(user) && (user.isAdmin || user.is_admin)) {
    return true;
  }
  
  // Check for specific DHL admin email
  if (user.email && typeof user.email === 'string') {
    const dhlAdminEmails = ['admindhl@pendlerapp.com'];
    return dhlAdminEmails.includes(user.email.toLowerCase());
  }
  
  return false;
};

export const canAccessDHLAdmin = (user: any): boolean => {
  return isDHLAdmin(user);
};

export const canAccessDHLFeatures = (user: any): boolean => {
  return isDHLEmployee(user);
};

export const isDHLPromoCode = (code: string): boolean => {
  if (!code) return false;
  
  // Check if code matches DHL promo code patterns
  const dhlCodePatterns = [
    /^DHL/i,
    /^EXPRESS/i,
    /^LOGISTICS/i
  ];
  
  return dhlCodePatterns.some(pattern => pattern.test(code.trim()));
};

export const getDHLSetupPath = (user: any, hasAssignment: boolean): string | null => {
  if (!isDHLEmployee(user)) return null;
  
  // If user doesn't have assignment, redirect to setup
  if (!hasAssignment) {
    return '/dhl-setup';
  }
  
  return null;
};
