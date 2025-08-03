import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserStatus, UnifiedUser } from '@/types/auth';
import { isDHLEmployeeSync, isDHLAdmin, isRegularAdmin } from '@/utils/dhlAuthUtils';

export interface RoleCache {
  data: any;
  timestamp: number;
  ttl: number;
}

export interface AuthData {
  profile: any;
  isAdmin: boolean;
  isPremium: boolean;
  isDHLEmployee: boolean;
  userAssignment?: any;
}

/**
 * Centralized role and permission management service
 * Handles caching, batch loading, and unified role detection
 */
export class RoleManager {
  private static instance: RoleManager;
  private cache = new Map<string, RoleCache>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly SPECIAL_EMAILS = ['uzivatel@pendlerapp.com', 'admin@pendlerapp.com', 'admin_dhl@pendlerapp.com', 'zkouska@gmail.com'];
  
  static getInstance(): RoleManager {
    if (!RoleManager.instance) {
      RoleManager.instance = new RoleManager();
    }
    return RoleManager.instance;
  }

  /**
   * Get cached data or return null if expired
   */
  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached || Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    return cached.data as T;
  }

  /**
   * Set data in cache with TTL
   */
  private setCache<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cache for specific user
   */
  clearUserCache(userId: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => key.includes(userId));
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Fast synchronous role detection for immediate UI updates
   */
  getQuickRoles(user: User | null): {
    isDHLEmployee: boolean;
    isAdmin: boolean;
    isSpecialUser: boolean;
    isPremium: boolean;
  } {
    if (!user?.email) {
      return {
        isDHLEmployee: false,
        isAdmin: false,
        isSpecialUser: false,
        isPremium: false
      };
    }

    const isSpecialUser = this.SPECIAL_EMAILS.includes(user.email);
    const isDHLEmployeeCheck = isDHLEmployeeSync(user);
    // Use sync fallback for quick roles
    const isDHLAdminUser = user.email === 'admin_dhl@pendlerapp.com' || isSpecialUser;
    const isRegularAdminUser = user.email === 'admin@pendlerapp.com' || isSpecialUser;

    return {
      isDHLEmployee: isDHLEmployeeCheck || isDHLAdminUser,
      isAdmin: isRegularAdminUser || isDHLAdminUser || isSpecialUser,
      isSpecialUser,
      isPremium: isSpecialUser || isDHLEmployeeCheck || isDHLAdminUser
    };
  }

  /**
   * Batch load all user data in one request
   */
  async loadUserData(userId: string): Promise<AuthData> {
    const cacheKey = `user_data_${userId}`;
    const cached = this.getCached<AuthData>(cacheKey);
    
    if (cached) {
      console.log('RoleManager: Using cached user data for:', userId);
      return cached;
    }

    try {
      console.log('RoleManager: Loading fresh user data for:', userId);

      // Load profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, is_admin, is_premium, premium_expiry, is_dhl_employee, company')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('RoleManager: Profile load error:', profileError);
        throw profileError;
      }

      // Load DHL assignment if needed
      let userAssignment = null;
      if (profile?.is_dhl_employee || profile?.company === 'dhl') {
        const { data: assignment } = await supabase
          .from('user_work_data')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        userAssignment = assignment;
      }

      // Determine final status
      const isAdmin = profile?.is_admin || false;
      const isPremiumActive = profile?.is_premium && 
        (!profile?.premium_expiry || new Date(profile.premium_expiry) > new Date());
      const isDHLEmployee = profile?.is_dhl_employee || false;

      const authData: AuthData = {
        profile,
        isAdmin,
        isPremium: isPremiumActive,
        isDHLEmployee,
        userAssignment
      };

      // Cache the result
      this.setCache(cacheKey, authData);

      return authData;
    } catch (error) {
      console.error('RoleManager: Failed to load user data:', error);
      
      // Return minimal data on error
      return {
        profile: null,
        isAdmin: false,
        isPremium: false,
        isDHLEmployee: false
      };
    }
  }

  /**
   * Create unified user object from loaded data
   */
  createUnifiedUser(
    user: User,
    authData: AuthData,
    quickRoles: ReturnType<typeof this.getQuickRoles>
  ): UnifiedUser {
    // Determine role with proper priority
    let role: UserRole;
    if (user.email === 'admin_dhl@pendlerapp.com' || quickRoles.isDHLEmployee) {
      role = UserRole.DHL_ADMIN;
    } else if (user.email === 'admin@pendlerapp.com' || authData.isAdmin) {
      role = UserRole.ADMIN;
    } else if (authData.isDHLEmployee || quickRoles.isDHLEmployee) {
      role = UserRole.DHL_EMPLOYEE;
    } else if (authData.isPremium || quickRoles.isPremium) {
      role = UserRole.PREMIUM;
    } else {
      role = UserRole.STANDARD;
    }

    // Determine status
    let status: UserStatus = UserStatus.ACTIVE;
    if (role === UserRole.DHL_EMPLOYEE && !authData.userAssignment) {
      status = UserStatus.PENDING_SETUP;
    }

    return {
      id: user.id,
      email: user.email || '',
      role,
      status,
      isPremium: authData.isPremium || quickRoles.isPremium,
      isAdmin: authData.isAdmin || quickRoles.isAdmin,
      isDHLEmployee: authData.isDHLEmployee || quickRoles.isDHLEmployee,
      isAdeccoEmployee: authData.profile?.company === 'adecco',
      isRandstadEmployee: authData.profile?.company === 'randstad',
      isDHLAdmin: role === UserRole.DHL_ADMIN,
      company: authData.profile?.company,
      premiumExpiry: authData.profile?.premium_expiry,
      setupRequired: status === UserStatus.PENDING_SETUP
    };
  }

  /**
   * Check if user has specific role
   */
  hasRole(unifiedUser: UnifiedUser | null, role: UserRole): boolean {
    if (!unifiedUser) return false;
    
    // Admin roles have access to lower-level roles
    if (unifiedUser.role === UserRole.ADMIN || unifiedUser.role === UserRole.DHL_ADMIN) {
      return true;
    }
    
    return unifiedUser.role === role;
  }

  /**
   * Check if user can access features requiring specific role
   */
  canAccess(unifiedUser: UnifiedUser | null, requiredRole: UserRole): boolean {
    if (!unifiedUser) return false;
    if (unifiedUser.status === UserStatus.SUSPENDED) return false;
    
    const roleHierarchy = {
      [UserRole.STANDARD]: 1,
      [UserRole.PREMIUM]: 2,
      [UserRole.DHL_EMPLOYEE]: 3,
      [UserRole.ADECCO_EMPLOYEE]: 3,
      [UserRole.RANDSTAD_EMPLOYEE]: 3,
      [UserRole.ADMIN]: 4,
      [UserRole.DHL_ADMIN]: 4
    };
    
    return roleHierarchy[unifiedUser.role] >= roleHierarchy[requiredRole];
  }
}

export const roleManager = RoleManager.getInstance();