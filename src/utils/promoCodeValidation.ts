import { supabase } from '@/integrations/supabase/client';

export interface PromoCodeValidation {
  isValid: boolean;
  isCompanyCode: boolean;
  company?: 'adecco' | 'randstad' | 'dhl' | null;
  premiumMonths?: number;
  error?: string;
}

export const validatePromoCode = async (code: string): Promise<PromoCodeValidation> => {
  if (!code) {
    return { isValid: true, isCompanyCode: false }; // Empty code is valid (optional)
  }

  try {
    const { data, error } = await supabase
      .from('company_premium_codes')
      .select('code, company, premium_duration_months, is_active')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

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
        premiumMonths: data.premium_duration_months
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

export const applyPromoCodeBenefits = async (userId: string, validation: PromoCodeValidation) => {
  if (!validation.isValid || !validation.premiumMonths) return;

  try {
    // Add premium subscription
    const premiumExpiry = new Date();
    premiumExpiry.setMonth(premiumExpiry.getMonth() + validation.premiumMonths);

    await supabase
      .from('subscribers')
      .upsert({
        user_id: userId,
        email: (await supabase.auth.getUser()).data.user?.email || '',
        subscribed: true,
        subscription_end: premiumExpiry.toISOString(),
        subscription_tier: validation.isCompanyCode ? 'company' : 'premium'
      });

    // If it's a company code, update user's company in profile
    if (validation.isCompanyCode && validation.company) {
      await supabase
        .from('profiles')
        .update({
          company: validation.company,
          is_dhl_employee: validation.company === 'dhl',
          is_adecco_employee: validation.company === 'adecco',
          is_randstad_employee: validation.company === 'randstad'
        })
        .eq('id', userId);
    }

    console.log('Promo code benefits applied:', validation);
  } catch (error) {
    console.error('Error applying promo code benefits:', error);
  }
};