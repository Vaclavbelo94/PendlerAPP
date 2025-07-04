
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/auth';
import { Crown, Calendar, CreditCard, Zap } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface ProfileSubscriptionProps {
  isPremium: boolean;
  premiumExpiry?: string | null;
}

const ProfileSubscription: React.FC<ProfileSubscriptionProps> = ({ isPremium, premiumExpiry }) => {
  const { unifiedUser } = useAuth();
  const { t } = useTranslation('premium');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  useEffect(() => {
    if (premiumExpiry) {
      setExpiryDate(new Date(premiumExpiry));
    } else {
      setExpiryDate(null);
    }
  }, [premiumExpiry]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isPremium ? (
            <>
              <Crown className="h-5 w-5 text-amber-500" />
              <span>{t('premium')}</span>
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 text-gray-500" />
              <span>{t('basic')}</span>
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isPremium ? (
            <>
              {t('activeSubscription')}{' '}
              {expiryDate ? (
                <>
                  {t('until')} {expiryDate.toLocaleDateString()}
                </>
              ) : (
                <>
                  {t('withoutExpiryDate')} <Zap className="h-3 w-3 inline-block" />
                </>
              )}
            </>
          ) : (
            <>
              {t('getAccessToAdvanced')}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPremium ? (
          <>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                <Crown className="h-4 w-4 mr-2" />
                {t('premium')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('youHaveActivePremium')}.
            </p>
            <Button variant="destructive" disabled>
              {t('cancelSubscription')}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {t('getAccessToAdvanced')}.
            </p>
            <Button asChild>
              <a href="/premium">
                {t('getPremium')}
              </a>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSubscription;
