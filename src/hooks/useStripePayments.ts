
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const useStripePayments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const { user, refreshPremiumStatus } = useAuth();

  const createCheckoutSession = async () => {
    if (!user) {
      toast.error('Musíte být přihlášeni pro nákup premium');
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      console.log('Checkout session created:', data);
      return data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Nepodařilo se vytvořit platební session');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async (): Promise<SubscriptionStatus | null> => {
    if (!user) {
      console.log('No user for subscription check');
      return null;
    }

    setIsCheckingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      console.log('Subscription status checked:', data);
      
      // Refresh premium status in auth context
      await refreshPremiumStatus();
      
      return data;
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast.error('Nepodařilo se zkontrolovat stav předplatného');
      return null;
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast.error('Musíte být přihlášeni');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Open portal in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error('Nepodařilo se otevřít správu předplatného');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    const checkoutUrl = await createCheckoutSession();
    if (checkoutUrl) {
      // Open Stripe checkout in new tab
      window.open(checkoutUrl, '_blank');
    }
  };

  return {
    isLoading,
    isCheckingSubscription,
    createCheckoutSession,
    checkSubscriptionStatus,
    openCustomerPortal,
    handleCheckout,
  };
};
