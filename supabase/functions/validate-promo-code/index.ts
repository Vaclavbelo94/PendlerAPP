import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { promoCode } = await req.json()
    
    console.log('Validating promo code:', promoCode)

    if (!promoCode) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Promo code is required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Query the promo code using raw SQL to bypass RLS policies that reference auth.uid()
    const { data: promoCodeData, error } = await supabaseClient.rpc('validate_promo_code_raw', {
      promo_code_input: promoCode.toUpperCase()
    })

    console.log('Database query result:', { data: promoCodeData, error })

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Database error occurred' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // The RPC returns an array, get the first item if it exists
    const codeData = promoCodeData && promoCodeData.length > 0 ? promoCodeData[0] : null;

    if (codeData) {
      // Check usage limits
      if (codeData.max_users && codeData.used_count >= codeData.max_users) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Promo code has reached maximum usage limit' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            id: codeData.id,
            code: codeData.code,
            name: codeData.name,
            description: codeData.description,
            company: codeData.company,
            premium_duration_months: codeData.premium_duration_months
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired promo code' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})