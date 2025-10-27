import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidatePromoRequest {
  promoCode: string;
  userId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { promoCode, userId }: ValidatePromoRequest = await req.json();

    console.log('Validating promo code:', promoCode, 'for user:', userId);

    // Check if promo code exists and is valid
    const { data: promoCodeData, error: promoError } = await supabase
      .from('company_premium_codes')
      .select('*')
      .ilike('code', promoCode)
      .eq('is_active', true)
      .lte('valid_from', new Date().toISOString())
      .gte('valid_until', new Date().toISOString())
      .single();

    if (promoError || !promoCodeData) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid or expired promo code' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    // Check if max users limit reached
    if (promoCodeData.max_users && promoCodeData.used_count >= promoCodeData.max_users) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Promo code usage limit reached' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Check if user already used this code
    const { data: existingRedemption } = await supabase
      .from('company_premium_code_redemptions')
      .select('id')
      .eq('user_id', userId)
      .eq('company_premium_code_id', promoCodeData.id)
      .single();

    if (existingRedemption) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Promo code already used by this user' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Return Google Play offer ID if available
    const googlePlayOfferId = promoCodeData.google_play_offer_id;

    return new Response(
      JSON.stringify({
        valid: true,
        promoCode: promoCodeData,
        googlePlayOfferId,
        canRedeemOnPlayStore: !!googlePlayOfferId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Promo code validation error:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
