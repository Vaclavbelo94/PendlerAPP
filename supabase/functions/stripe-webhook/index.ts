import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No stripe signature");

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    logStep(`Processing event: ${event.type}`, { id: event.id });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const email = session.customer_details?.email || session.metadata?.user_email;
        const period = session.metadata?.period || 'monthly';
        
        logStep("Checkout completed", { userId, email, period });
        
        if (userId && email) {
          // Calculate expiry based on period
          const expiryDate = new Date();
          if (period === 'yearly') {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          } else {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
          }
          
          // Immediately activate premium
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              is_premium: true,
              premium_expiry: expiryDate.toISOString()
            })
            .eq('id', userId);
          
          if (profileError) {
            logStep("Error updating profile", { error: profileError });
          } else {
            logStep("Premium activated for user", { userId, expiresAt: expiryDate });
          }

          // Update subscribers table
          const { error: subscriberError } = await supabase
            .from('subscribers')
            .upsert({
              user_id: userId,
              email: email,
              stripe_customer_id: session.customer as string,
              subscribed: true,
              subscription_end: expiryDate.toISOString(),
              subscription_tier: 'premium',
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

          if (subscriberError) {
            logStep("Error updating subscriber", { error: subscriberError });
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const isActive = subscription.status === 'active';
        
        logStep(`Subscription ${event.type}`, { customerId, status: subscription.status });
        
        const customer = await stripe.customers.retrieve(customerId);
        const email = (customer as Stripe.Customer).email;
        
        if (email) {
          const expiryDate = isActive 
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null;
          
          // Update profile
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              is_premium: isActive,
              premium_expiry: expiryDate
            })
            .eq('email', email);

          if (profileError) {
            logStep("Error updating profile", { error: profileError });
          }
          
          // Update subscribers
          const { error: subscriberError } = await supabase
            .from('subscribers')
            .upsert({
              email: email,
              stripe_customer_id: customerId,
              subscribed: isActive,
              subscription_end: expiryDate,
              updated_at: new Date().toISOString()
            }, { onConflict: 'email' });

          if (subscriberError) {
            logStep("Error updating subscriber", { error: subscriberError });
          }
          
          logStep(`Subscription ${isActive ? 'activated' : 'deactivated'}`, { email });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        
        logStep("Payment failed", { customerId });
        
        const customer = await stripe.customers.retrieve(customerId);
        const email = (customer as Stripe.Customer).email;
        
        if (email) {
          // Could add notification to user here
          logStep("Payment failed notification should be sent", { email });
        }
        break;
      }

      default:
        logStep(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
});
