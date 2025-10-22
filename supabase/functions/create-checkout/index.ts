
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create a Supabase client using the anon key for auth verification
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body to get period
    let period = 'monthly';
    try {
      const body = await req.json();
      period = body.period || 'monthly';
      logStep("Period selected", { period });
    } catch (e) {
      logStep("No body or period provided, using default monthly");
    }

    // Detect user language from metadata or default to 'cs'
    const userLanguage = user.user_metadata?.language || 'cs';
    logStep("User language detected", { language: userLanguage });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer already exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer found, will create new one");
    }

    const origin = req.headers.get("origin") || 
                   req.headers.get("referer")?.split('/').slice(0, 3).join('/') ||
                   "https://ghfjdgnnhhxhamcwjodx.supabase.co";
    
    // Multi-currency pricing based on user language
    const pricingConfig = {
      cs: {
        currency: "czk",
        monthly: { amount: 10000, description: "Měsíční Premium předplatné" },
        yearly: { amount: 100000, description: "Roční Premium předplatné (17% úspora)" }
      },
      de: {
        currency: "eur",
        monthly: { amount: 400, description: "Monatliches Premium-Abonnement" },
        yearly: { amount: 4000, description: "Jährliches Premium-Abonnement (17% Ersparnis)" }
      },
      pl: {
        currency: "pln",
        monthly: { amount: 1700, description: "Miesięczna subskrypcja Premium" },
        yearly: { amount: 17000, description: "Roczna subskrypcja Premium (17% rabatu)" }
      }
    };

    const config = pricingConfig[userLanguage as keyof typeof pricingConfig] || pricingConfig.cs;
    const selectedPricing = period === 'yearly' ? config.yearly : config.monthly;
    logStep("Pricing selected", { period, language: userLanguage, currency: config.currency, amount: selectedPricing.amount });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: config.currency,
            product_data: { 
              name: "Premium Předplatné",
              description: selectedPricing.description
            },
            unit_amount: selectedPricing.amount,
            recurring: { interval: period === 'yearly' ? 'year' : 'month' },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/premium?canceled=true`,
      metadata: {
        user_id: user.id,
        user_email: user.email,
        period: period,
        language: userLanguage,
        currency: config.currency
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url, period });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
