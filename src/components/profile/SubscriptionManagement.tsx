
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Crown, CreditCard, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface SubscriptionManagementProps {
  // You can add props here if needed
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ /* props */ }) => {
  const { user, unifiedUser, refreshPremiumStatus } = useAuth();
  const { t } = useTranslation('premium');
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isPremium: boolean | null;
    premiumExpiry: string | null;
    isLoading: boolean;
  }>({
    isPremium: null,
    premiumExpiry: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user?.id) {
        setSubscriptionStatus({ isPremium: false, premiumExpiry: null, isLoading: false });
        return;
      }

      setSubscriptionStatus(prev => ({ ...prev, isLoading: true }));

      try {
        const { isPremium, premiumExpiry } = await refreshPremiumStatus();
        setSubscriptionStatus({ isPremium: isPremium, premiumExpiry: premiumExpiry || null, isLoading: false });
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        setSubscriptionStatus({ isPremium: false, premiumExpiry: null, isLoading: false });
      }
    };

    fetchSubscriptionStatus();
  }, [user?.id, refreshPremiumStatus]);

  const cancelSubscription = async () => {
    if (!user?.id) return;

    try {
      // Call Supabase function to cancel subscription
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { userId: user.id },
      });

      if (error) {
        console.error("Error cancelling subscription:", error);
        toast.error("Failed to cancel subscription. Please contact support.");
        return;
      }

      toast.success("Subscription cancelled successfully.");
      await refreshPremiumStatus();
    } catch (error) {
      console.error("Unexpected error cancelling subscription:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const isSubscriptionActive = subscriptionStatus.isPremium &&
    (!subscriptionStatus.premiumExpiry || new Date(subscriptionStatus.premiumExpiry) > new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>{t('subscriptionManagement')}</span>
        </CardTitle>
        <CardDescription>
          {t('manageSubscriptionHere')}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscriptionStatus.isLoading ? (
          <p>{t('loadingSubscriptionStatus')}...</p>
        ) : (
          <>
            {isSubscriptionActive ? (
              <>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t('yourPremiumIsActive')}.
                    {subscriptionStatus.premiumExpiry && (
                      <> {t('expires')} {new Date(subscriptionStatus.premiumExpiry).toLocaleDateString()}.</>
                    )}
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('featuresUsage')}:</span>
                    <span>80%</span>
                  </div>
                  <Progress value={80} />
                </div>
                <Button variant="destructive" onClick={cancelSubscription}>
                  {t('cancelSubscription')}
                </Button>
              </>
            ) : (
              <>
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t('noActivePremium')}.
                  </AlertDescription>
                </Alert>
                <Button>
                  {t('activatePremium')}
                </Button>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionManagement;
