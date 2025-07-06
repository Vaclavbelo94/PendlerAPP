
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface DHLAuthState {
  isDHLEmployee: boolean;
  hasAssignment: boolean;
  canAccessDHLFeatures: boolean;
}

/**
 * Unified DHL employee check - checks both promo codes and profile flag
 */
export const isDHLEmployee = async (user: User | null): Promise<boolean> => {
  if (!user?.id) {
    console.log('DHL Employee check: No user ID provided');
    return false;
  }
  
  // Admin override for testing - admin_dhl@pendlerapp.com can always access
  if (user.email === 'admin_dhl@pendlerapp.com') {
    console.log('DHL Employee check: Admin override granted');
    return true;
  }
  
  try {
    // Check profile flag first (fastest check)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_dhl_employee')
      .eq('id', user.id)
      .single();

    if (!profileError && profileData?.is_dhl_employee) {
      console.log('DHL Employee check: Found via profile flag');
      return true;
    }

    // If profile flag is not set, check promo code redemption
    const { data: promoData, error: promoError } = await supabase
      .from('promo_code_redemptions')
      .select(`
        promo_codes (
          code
        )
      `)
      .eq('user_id', user.id);

    if (promoError) {
      console.error('Error checking DHL promo codes:', promoError);
      return false;
    }

    const dhlPromoCodes = ['DHL2026', 'DHL2025', 'DHLSPECIAL'];
    const hasDHLPromo = promoData?.some(redemption => 
      redemption.promo_codes && 
      dhlPromoCodes.includes(redemption.promo_codes.code.toUpperCase())
    ) || false;

    // If user has DHL promo but profile flag is not set, update it
    if (hasDHLPromo && !profileData?.is_dhl_employee) {
      console.log('DHL Employee check: Updating profile flag based on promo code');
      await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          is_dhl_employee: true,
          updated_at: new Date().toISOString()
        });
    }

    console.log('DHL Employee check:', { 
      userId: user.id,
      email: user.email, 
      profileFlag: profileData?.is_dhl_employee,
      hasDHLPromo,
      result: hasDHLPromo
    });
    
    return hasDHLPromo;
  } catch (error) {
    console.error('Error in isDHLEmployee:', error);
    return false;
  }
};

/**
 * Synchronous version - only checks profile flag and admin override
 * Use this when you need immediate result without async calls
 */
export const isDHLEmployeeSync = (user: User | null): boolean => {
  if (!user?.email) {
    console.log('DHL Employee sync check: No email provided');
    return false;
  }
  
  // Admin override for testing - admin_dhl@pendlerapp.com can always access
  if (user.email === 'admin_dhl@pendlerapp.com') {
    console.log('DHL Employee sync check: Admin override granted');
    return true;
  }
  
  // Check if user profile has is_dhl_employee flag set
  // This will be set by the profile data when loaded by useEnhancedAuth
  const profileData = user.user_metadata || {};
  const isDHLFromProfile = profileData.is_dhl_employee === true;
  
  console.log('DHL Employee sync check:', {
    email: user.email,
    isDHLFromProfile,
    userMetadata: profileData
  });
  
  return isDHLFromProfile;
};

/**
 * Check if user is DHL admin
 */
export const isDHLAdmin = (user: User | null): boolean => {
  const isAdmin = user?.email === 'admin_dhl@pendlerapp.com';
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
 * Get admin redirect path based on user type
 */
export const getAdminRedirectPath = (user: User | null): string | null => {
  if (isDHLAdmin(user)) {
    return '/dhl-admin';
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
