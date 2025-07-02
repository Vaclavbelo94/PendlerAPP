
import { User } from '@supabase/supabase-js';
import { UserRole, UserStatus, UnifiedUser } from '@/types/auth';
import { isDHLEmployee, isDHLAdmin, isRegularAdmin } from './dhlAuthUtils';

/**
 * Determine user role based on email and other factors
 */
export const determineUserRole = (user: User | null): UserRole => {
  if (!user?.email) return UserRole.STANDARD;
  
  if (isDHLAdmin(user)) return UserRole.DHL_ADMIN;
  if (isRegularAdmin(user)) return UserRole.ADMIN;
  if (isDHLEmployee(user)) return UserRole.DHL_EMPLOYEE;
  
  return UserRole.STANDARD;
};

/**
 * Determine user status based on role and setup requirements
 */
export const determineUserStatus = (
  user: User | null, 
  role: UserRole,
  hasAssignment?: boolean
): UserStatus => {
  if (!user) return UserStatus.SUSPENDED;
  
  // DHL employees need setup if they don't have assignment
  if (role === UserRole.DHL_EMPLOYEE && !hasAssignment) {
    return UserStatus.PENDING_SETUP;
  }
  
  return UserStatus.ACTIVE;
};

/**
 * Create unified user object from Supabase user and additional data
 */
export const createUnifiedUser = (
  user: User | null,
  isPremium: boolean = false,
  isAdmin: boolean = false,
  premiumExpiry?: string,
  hasAssignment?: boolean
): UnifiedUser | null => {
  if (!user) return null;
  
  const role = determineUserRole(user);
  const status = determineUserStatus(user, role, hasAssignment);
  
  return {
    id: user.id,
    email: user.email || '',
    role,
    status,
    isPremium: isPremium || role === UserRole.PREMIUM || role === UserRole.DHL_EMPLOYEE,
    isAdmin: isAdmin || role === UserRole.ADMIN || role === UserRole.DHL_ADMIN,
    isDHLEmployee: role === UserRole.DHL_EMPLOYEE || role === UserRole.DHL_ADMIN,
    isDHLAdmin: role === UserRole.DHL_ADMIN,
    premiumExpiry,
    setupRequired: status === UserStatus.PENDING_SETUP
  };
};

/**
 * Check if user has specific role
 */
export const hasRole = (unifiedUser: UnifiedUser | null, role: UserRole): boolean => {
  if (!unifiedUser) return false;
  
  // Admin roles have access to lower-level roles
  if (unifiedUser.role === UserRole.ADMIN || unifiedUser.role === UserRole.DHL_ADMIN) {
    return true;
  }
  
  return unifiedUser.role === role;
};

/**
 * Check if user can access features requiring specific role
 */
export const canAccess = (unifiedUser: UnifiedUser | null, requiredRole: UserRole): boolean => {
  if (!unifiedUser) return false;
  if (unifiedUser.status === UserStatus.SUSPENDED) return false;
  
  const roleHierarchy = {
    [UserRole.STANDARD]: 1,
    [UserRole.PREMIUM]: 2,
    [UserRole.DHL_EMPLOYEE]: 3,
    [UserRole.ADMIN]: 4,
    [UserRole.DHL_ADMIN]: 4
  };
  
  return roleHierarchy[unifiedUser.role] >= roleHierarchy[requiredRole];
};

/**
 * Get redirect path based on user role and status
 */
export const getRedirectPath = (unifiedUser: UnifiedUser | null): string => {
  if (!unifiedUser) return '/login';
  
  if (unifiedUser.status === UserStatus.PENDING_SETUP) {
    if (unifiedUser.isDHLEmployee) return '/dhl-setup';
    return '/setup';
  }
  
  if (unifiedUser.isDHLAdmin) return '/DHLAdmin';
  if (unifiedUser.isAdmin) return '/admin';
  
  return '/dashboard';
};

/**
 * Check if user needs to complete setup
 */
export const needsSetup = (unifiedUser: UnifiedUser | null): boolean => {
  return unifiedUser?.status === UserStatus.PENDING_SETUP;
};
