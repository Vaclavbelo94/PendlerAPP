
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/auth';
import { Crown, Calendar, CreditCard, Zap } from "lucide-react";

interface ProfileSubscriptionProps {
  isPremium?: boolean;
  premiumExpiry?: string | null;
}

const ProfileSubscription: React.FC<ProfileSubscriptionProps> = ({ 
  isPremium: propIsPremium, 
  premiumExpiry: propPremiumExpiry 
}) => {
  const { unifiedUser } = useAuth();
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  // Use props if provided, otherwise fall back to auth context
  const isPremium = propIsPremium ?? unifiedUser?.hasPremiumAccess ?? false;
  const premiumExpiry = propPremiumExpiry ?? null;

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
              <span>Premium</span>
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 text-gray-500" />
              <span>Základní</span>
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isPremium ? (
            <>
              Aktivní předplatné{' '}
              {expiryDate ? (
                <>
                  do {expiryDate.toLocaleDateString()}
                </>
              ) : (
                <>
                  bez data vypršení platnosti <Zap className="h-3 w-3 inline-block" />
                </>
              )}
            </>
          ) : (
            <>
              Získejte přístup k pokročilým funkcím
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
                Premium
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Máte aktivní Premium členství.
            </p>
            <Button variant="destructive" disabled>
              Zrušit předplatné
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Odemkněte pokročilé funkce a vylepšete svůj zážitek.
            </p>
            <Button asChild>
              <a href="/premium">
                Získat Premium
              </a>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSubscription;
