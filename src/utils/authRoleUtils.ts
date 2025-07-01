
import { UnifiedUser, UserRole } from '@/contexts/UnifiedAuthContext';
import { User } from '@supabase/supabase-js';

export const createUnifiedUser = (
  authUser: User,
  isPremium = false,
  isAdmin = false,
  premiumExpiry?: string,
  isDHLEmployee = false
): UnifiedUser => {
  // Check if this is a special email that should have premium
  const specialEmails = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'zkouska@gmail.com'];
  const hasAutoPremiun = authUser.email && specialEmails.includes(authUser.email);
  
  // Override premium status for special emails
  if (hasAutoPremiun) {
    isPremium = true;
    premiumExpiry = premiumExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  }
  
  const role: UserRole = isAdmin ? 'admin' : isPremium ? 'premium' : 'standard';
  
  return {
    id: authUser.id,
    email: authUser.email || '',
    displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
    role,
    status: 'active',
    hasPremiumAccess: isPremium,
    hasAdminAccess: isAdmin,
    isDHLEmployee,
    premiumExpiry,
    // Backward compatibility
    isPremium,
    isAdmin,
    // Unified naming - both properties pointing to the same value
    isDHLUser: isDHLEmployee,
  };
};

export const canAccess = (user: UnifiedUser | null, requiredRole: UserRole): boolean => {
  if (!user) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    'standard': 1,
    'premium': 2,
    'dhl_employee': 2,
    'dhl_admin': 3,
    'admin': 4
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

export const hasRole = (user: UnifiedUser | null, role: UserRole): boolean => {
  return user?.role === role || user?.role === 'admin';
};
