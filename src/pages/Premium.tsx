
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Star, Check, Zap, Shield, Rocket, Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useStripePayments, PaymentPeriod } from '@/hooks/useStripePayments';
import PeriodSelector from '@/components/premium/PeriodSelector';
import PromoCodeRedemption from '@/components/premium/PromoCodeRedemption';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { toast } from 'sonner';

const Premium = () => {
  const { isPremium } = useAuth();
  const { t, i18n } = useTranslation('premium');
  const { handleCheckout, isLoading } = useStripePayments();
  const [selectedPeriod, setSelectedPeriod] = useState<PaymentPeriod>('monthly');

  const currentLanguage = i18n.language;

  // Currency and pricing based on language
  const getPricingInfo = () => {
    switch (currentLanguage) {
      case 'pl':
        return {
          currency: 'PLN',
          monthlyPrice: 17,
          yearlyPrice: 170,
          savings: '17%'
        };
      case 'de':
        return {
          currency: 'EUR',
          monthlyPrice: 4,
          yearlyPrice: 40,
          savings: '17%'
        };
      default: // cs
        return {
          currency: 'CZK',
          monthlyPrice: 100,
          yearlyPrice: 1000,
          savings: '17%'
        };
    }
  };

  const pricing = getPricingInfo();

  const premiumFeatures = [
    {
      icon: Star,
      title: t('features.noAds.title'),
      description: t('features.noAds.description')
    },
    {
      icon: Zap,
      title: t('features.unlimitedAccess.title'),
      description: t('features.unlimitedAccess.description')
    },
    {
      icon: Shield,
      title: t('features.prioritySupport.title'),
      description: t('features.prioritySupport.description')
    },
    {
      icon: Rocket,
      title: t('features.advancedFeatures.title'),
      description: t('features.advancedFeatures.description')
    }
  ];

  const handlePremiumActivation = async () => {
    try {
      await handleCheckout(selectedPeriod);
    } catch (error) {
      toast.error(t('errors.paymentFailed'));
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('title')} | PendlerApp</title>
        <meta name="description" content={t('subtitle')} />
      </Helmet>
      
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Crown className="h-8 w-8 text-amber-500" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isPremium ? (
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300">
                    <Crown className="h-6 w-6" />
                    {t('premiumUser.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('premiumUser.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                        <Check className="h-5 w-5 text-green-600" />
                        <div>
                          <h3 className="font-medium">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Crown className="h-6 w-6 text-amber-500" />
                      {t('upgrade.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('upgrade.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-4">
                        {t('upgrade.selectPeriod')}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {t('upgrade.saveWithYearly')}
                      </p>
                    </div>
                    
                    <PeriodSelector 
                      selectedPeriod={selectedPeriod}
                      onPeriodChange={setSelectedPeriod}
                      pricing={pricing}
                    />
                    
                    <Button 
                      size="lg" 
                      className="w-full max-w-sm"
                      onClick={handlePremiumActivation}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('upgrade.processing')}
                        </>
                      ) : (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          {t('upgrade.activateButton')}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <PromoCodeRedemption />

                <Card>
                  <CardHeader>
                    <CardTitle>{t('benefits.title')}</CardTitle>
                    <CardDescription>
                      {t('benefits.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {premiumFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                          <feature.icon className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h3 className="font-medium mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </Layout>
    </>
  );
};

export default Premium;
