
// Utility functions for DHL authentication checks

export const isDHLEmployee = (user: any): boolean => {
  if (!user) return false;
  
  // Check if user has DHL-specific properties
  if (user.isDHLEmployee || user.isDHLUser) {
    return true;
  }
  
  // Check email domain for DHL employees
  if (user.email && typeof user.email === 'string') {
    const dhlDomains = ['dhl.com', 'dhl.de', 'dhl.cz'];
    const emailDomain = user.email.split('@')[1]?.toLowerCase();
    return dhlDomains.includes(emailDomain);
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
