import { supabase } from '@/integrations/supabase/client';

export interface PromoCodeValidation {
  isValid: boolean;
  isCompanyCode: boolean;
  company?: 'adecco' | 'randstad' | 'dhl' | null;
  premiumMonths?: number;
  error?: string;
  codeInfo?: {
    id: string;
    code: string;
    name: string;
    description?: string;
  };
}

// Pre-registration validation using edge function for better reliability
export const validatePromoCodePreRegistration = async (code: string): Promise<PromoCodeValidation> => {
  if (!code) {
    return { isValid: true, isCompanyCode: false }; // Empty code is valid (optional)
  }

  try {
    const { data, error } = await supabase.functions.invoke('validate-promo-code', {
      body: { promoCode: code }
    });

    if (error) {
      console.error('Edge function error:', error);
      return { 
        isValid: false, 
        isCompanyCode: false, 
        error: 'Chyba při ověřování promo kódu' 
      };
    }

    if (data?.success && data?.data) {
      const promoData = data.data;
      return {
        isValid: true,
        isCompanyCode: !!promoData.company,
        company: promoData.company,
        premiumMonths: promoData.premium_duration_months,
        codeInfo: {
          id: promoData.id,
          code: promoData.code,
          name: promoData.name,
          description: promoData.description
        }
      };
    }

    return { 
      isValid: false, 
      isCompanyCode: false, 
      error: data?.error || 'Promo kód nebyl nalezen' 
    };
  } catch (error) {
    console.error('Promo code validation error:', error);
    return { 
      isValid: false, 
      isCompanyCode: false, 
      error: 'Chyba při ověřování promo kódu' 
    };
  }
};

// Legacy validation function for backward compatibility
export const validatePromoCode = async (code: string): Promise<PromoCodeValidation> => {
  if (!code) {
    return { isValid: true, isCompanyCode: false }; // Empty code is valid (optional)
  }

  try {
    const { data, error } = await supabase
      .from('company_premium_codes')
      .select('id, code, name, description, company, premium_duration_months, is_active')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      return { 
        isValid: false, 
        isCompanyCode: false, 
        error: 'Neplatný promo kód' 
      };
    }

    if (data) {
      return {
        isValid: true,
        isCompanyCode: !!data.company,
        company: data.company,
        premiumMonths: data.premium_duration_months,
        codeInfo: {
          id: data.id,
          code: data.code,
          name: data.name,
          description: data.description
        }
      };
    }

    return { 
      isValid: false, 
      isCompanyCode: false, 
      error: 'Promo kód nebyl nalezen' 
    };
  } catch (error) {
    console.error('Promo code validation error:', error);
    return { 
      isValid: false, 
      isCompanyCode: false, 
      error: 'Chyba při ověřování promo kódu' 
    };
  }
};

// Enhanced promo code benefits application with full profile update
export const applyPromoCodeBenefits = async (userId: string, validation: PromoCodeValidation) => {
  if (!validation.isValid || !validation.premiumMonths || !validation.codeInfo) return;

  try {
    const premiumExpiry = new Date();
    premiumExpiry.setMonth(premiumExpiry.getMonth() + validation.premiumMonths);

    // Use a transaction-like approach with multiple operations
    const operations = [];

    // 1. Update profiles table with premium status and company info
    operations.push(
      supabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_expiry: premiumExpiry.toISOString(),
          company: validation.company || null,
          is_dhl_employee: validation.company === 'dhl',
          is_adecco_employee: validation.company === 'adecco',
          is_randstad_employee: validation.company === 'randstad',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    );

    // 2. Create/update subscriber record
    const userEmail = (await supabase.auth.getUser()).data.user?.email || '';
    operations.push(
      supabase
        .from('subscribers')
        .upsert({
          user_id: userId,
          email: userEmail,
          subscribed: true,
          subscription_end: premiumExpiry.toISOString(),
          subscription_tier: validation.isCompanyCode ? 'company' : 'premium',
          updated_at: new Date().toISOString()
        })
    );

    // 3. Create redemption record if we have code info
    if (validation.codeInfo?.id) {
      operations.push(
        supabase
          .from('company_premium_code_redemptions')
          .insert({
            user_id: userId,
            company_premium_code_id: validation.codeInfo.id,
            redeemed_at: new Date().toISOString(),
            premium_expires_at: premiumExpiry.toISOString()
          })
      );

      // 4. Get current usage count and increment it
      const { data: currentCode } = await supabase
        .from('company_premium_codes')
        .select('used_count')
        .eq('id', validation.codeInfo.id)
        .single();

      if (currentCode) {
        operations.push(
          supabase
            .from('company_premium_codes')
            .update({ 
              used_count: (currentCode.used_count || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', validation.codeInfo.id)
        );
      }
    }

    // Execute all operations
    const results = await Promise.allSettled(operations);
    
    // Log any failures but don't throw
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Operation ${index} failed:`, result.reason);
      }
    });

    console.log('Promo code benefits applied successfully:', {
      userId,
      validation,
      premiumExpiry: premiumExpiry.toISOString()
    });

  } catch (error) {
    console.error('Error applying promo code benefits:', error);
    throw error; // Re-throw for caller to handle
  }
};

// Fallback function to fix inconsistent user states
export const fixUserPremiumStatus = async (userId: string) => {
  try {
    // Check if user has active subscription but profile doesn't reflect it
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('user_id', userId)
      .eq('subscribed', true)
      .maybeSingle();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // If subscriber exists but profile doesn't show premium, fix it
    if (subscriber && profile && !profile.is_premium) {
      console.log('Fixing inconsistent premium status for user:', userId);
      
      await supabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_expiry: subscriber.subscription_end,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      return { fixed: true, reason: 'premium_status_mismatch' };
    }

    return { fixed: false, reason: 'no_issues_found' };
  } catch (error) {
    console.error('Error fixing user premium status:', error);
    return { fixed: false, reason: 'error', error: error };
  }
};