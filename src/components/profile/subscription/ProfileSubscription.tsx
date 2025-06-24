
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Crown, Star, Check, ArrowRight } from "lucide-react";
import { useTranslation } from 'react-i18next';

const ProfileSubscription = () => {
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('profile');

  const premiumFeatures = [
    t('withoutAdsInApp'),
    t('accessToAllLanguageLessons'),
    t('advancedStatisticsAndAnalytics'),
    t('unlimitedSynchronization'),
    t('prioritySupport'),
    t('dataAndReportsExport'),
    t('offlineModeForAllFeatures')
  ];

  if (isPremium) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <Crown className="h-5 w-5" />
            {t('premiumAccountActive')}
          </CardTitle>
          <CardDescription>
            {t('enjoyingAllFeatures')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              {t('premium')}
            </Badge>
            <span className="text-sm text-muted-foreground">{t('activePremiumSubscription')}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => navigate('/premium')}
              className="w-full"
            >
              {t('manageSubscription')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          {t('upgradeToPremiumTitle')}
        </CardTitle>
        <CardDescription>
          {t('unlockAllFeaturesDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <Crown className="h-12 w-12 mx-auto mb-3 text-primary" />
          <h3 className="text-lg font-semibold mb-2">{t('becomePremiumUser')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('getAccessToAllFeatures')}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">{t('premiumBenefits')}</h4>
          <div className="grid grid-cols-1 gap-2">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={() => navigate('/premium')}
            className="w-full"
            size="lg"
          >
            <Crown className="h-4 w-4 mr-2" />
            {t('activatePremium')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSubscription;
