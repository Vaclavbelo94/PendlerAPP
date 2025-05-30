
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type PaymentPeriod = 'monthly' | 'yearly';

export const useStripePayments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  const handleCheckout = async (period: PaymentPeriod = 'monthly') => {
    setIsLoading(true);
    try {
      console.log('Starting checkout process with period:', period);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { period }
      });
      
      if (error) {
        console.error('Checkout error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to checkout:', data.url);
        // Open checkout in new tab instead of current window
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error('Nepodařilo se vytvořit platební session');
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async (retryOnFail = false) => {
    setIsCheckingSubscription(true);
    try {
      console.log('Checking subscription status...');
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Subscription check error:', error);
        if (retryOnFail) {
          // Wait 1 second and try again
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await checkSubscriptionStatus(false);
        }
        throw error;
      }

      console.log('Subscription status:', data);
      return data;
    } catch (error: any) {
      console.error('Error checking subscription:', error);
      toast.error('Nepodařilo se ověřit stav předplatného');
      return null;
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const openCustomerPortal = async () => {
    setIsLoading(true);
    try {
      console.log('Opening customer portal...');
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Customer portal error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to customer portal:', data.url);
        window.open(data.url, '_blank');
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast.error('Nepodařilo se otevřít správu předplatného');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isCheckingSubscription,
    handleCheckout,
    checkSubscriptionStatus,
    openCustomerPortal,
  };
};
