import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RevenueCatEvent {
  event: {
    type: string;
    app_user_id: string;
    product_id: string;
    transaction_id: string;
    purchased_at_ms: number;
    expiration_at_ms?: number;
    store: string;
    is_trial_period?: boolean;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: RevenueCatEvent = await req.json();
    const event = payload.event;

    console.log('RevenueCat webhook received:', event.type, event.app_user_id);

    // Store transaction in database
    await supabase.from('revenuecat_transactions').insert({
      user_id: event.app_user_id,
      transaction_id: event.transaction_id,
      product_id: event.product_id,
      purchase_date: new Date(event.purchased_at_ms).toISOString(),
      expiration_date: event.expiration_at_ms 
        ? new Date(event.expiration_at_ms).toISOString() 
        : null,
      store: event.store,
      event_type: event.type,
      is_trial: event.is_trial_period || false,
      raw_data: payload
    });

    // Handle different event types
    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'NON_RENEWING_PURCHASE':
        await supabase
          .from('profiles')
          .update({
            is_premium: true,
            premium_expiry: event.expiration_at_ms 
              ? new Date(event.expiration_at_ms).toISOString()
              : null,
            subscription_source: 'google_play'
          })
          .eq('id', event.app_user_id);
        
        console.log('Premium activated for user:', event.app_user_id);
        break;

      case 'CANCELLATION':
        // Don't immediately remove premium - wait for expiration
        console.log('Subscription cancelled for user:', event.app_user_id);
        break;

      case 'EXPIRATION':
      case 'BILLING_ISSUE':
        await supabase
          .from('profiles')
          .update({
            is_premium: false,
            premium_expiry: null
          })
          .eq('id', event.app_user_id);
        
        console.log('Premium deactivated for user:', event.app_user_id);
        break;

      case 'UNCANCELLATION':
        // Subscription was reactivated
        await supabase
          .from('profiles')
          .update({
            is_premium: true,
            subscription_source: 'google_play'
          })
          .eq('id', event.app_user_id);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
