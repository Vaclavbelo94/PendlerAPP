import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check, Crown, Star } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import Layout from '@/components/layouts/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/auth';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { getPricing } from '@/config/pricing';
import { PlayBillingPurchase } from '@/components/premium/PlayBillingPurchase';

type PaymentPeriod = 'monthly' | 'yearly';

const Pricing = () => {
  const { t, i18n } = useTranslation(['pricing', 'navigation']);
  const navigate = useNavigate();
  const { user, isPremium, unifiedUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<PaymentPeriod>('yearly');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Get pricing from centralized config
  const pricingConfig = getPricing(i18n.language);
  const pricing = {
    currency: pricingConfig.currency,
    monthly: pricingConfig.monthlyPrice.toString(),
    yearly: pricingConfig.yearlyPrice.toString(),
    savings: pricingConfig.savings.toString()
  };
  const features = [
    'pricingFeature1',
    'pricingFeature2',
    'pricingFeature3',
    'pricingFeature4',
    'pricingFeature5',
    'pricingFeature6'
  ];

  const handleBuyPremium = () => {
    if (!user) {
      setShowAuthDialog(true);
    } else if (isPremium) {
      // User already has premium, show current plan info
      return;
    } else {
      navigate('/premium');
    }
  };

  // Check if user has premium and get expiry info
  const getPremiumStatusInfo = () => {
    if (!user) return { hasPremium: false };
    
    if (unifiedUser?.isDHLEmployee) {
      return { 
        hasPremium: true, 
        isDHL: true,
        message: t('pricing:dhlEmployeePremium')
      };
    }
    
    if (isPremium) {
      return { 
        hasPremium: true, 
        expiryDate: unifiedUser?.premiumExpiry,
        message: t('pricing:currentPremiumPlan')
      };
    }
    
    return { hasPremium: false };
  };

  const premiumStatus = getPremiumStatusInfo();
  const platform = Capacitor.getPlatform();
  const isNative = platform === 'android' || platform === 'ios';

  return (
    <>
      <Helmet>
        <title>{t('pricing:title')} | DHL Helper</title>
        <meta name="description" content={t('pricing:description')} />
      </Helmet>
      
      <Layout navbarRightContent={<NavbarRightContent />}>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Android/iOS Native Billing */}
          {isNative && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <PlayBillingPurchase />
            </motion.div>
          )}
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <Crown className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('pricing:title')}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('pricing:subtitle')}
            </p>
          </motion.div>

          {/* Period Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-card rounded-lg p-1 border">
              <div className="flex space-x-1">
                <Button
                  variant={selectedPeriod === 'monthly' ? 'default' : 'ghost'}
                  onClick={() => setSelectedPeriod('monthly')}
                  className="px-6"
                >
                  {t('pricing:monthly')}
                </Button>
                <Button
                  variant={selectedPeriod === 'yearly' ? 'default' : 'ghost'}
                  onClick={() => setSelectedPeriod('yearly')}
                  className="px-6 relative"
                >
                  {t('pricing:yearly')}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    -{pricing.savings}%
                  </Badge>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{t('pricing:freePlan')}</CardTitle>
                  <div className="text-3xl font-bold">
                    0 {pricing.currency}
                  </div>
                  <p className="text-muted-foreground">{t('pricing:freePlanDesc')}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {t('pricing:freeFeature1')}
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {t('pricing:freeFeature2')}
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {t('pricing:freeFeature3')}
                    </li>
                  </ul>
                  <Button 
                    variant={!premiumStatus.hasPremium ? "default" : "outline"} 
                    className="w-full" 
                    disabled={!premiumStatus.hasPremium}
                  >
                    {!premiumStatus.hasPremium ? t('pricing:currentPlan') : t('pricing:freePlan')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full border-primary shadow-lg relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    {t('pricing:mostPopular')}
                  </Badge>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl flex items-center justify-center">
                    <Crown className="h-6 w-6 mr-2 text-primary" />
                    {t('pricing:premiumPlan')}
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    {selectedPeriod === 'yearly' ? pricing.yearly : pricing.monthly} {pricing.currency}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{selectedPeriod === 'yearly' ? t('pricing:year') : t('pricing:month')}
                    </span>
                  </div>
                  {selectedPeriod === 'yearly' && (
                    <p className="text-sm text-green-600">
                      {t('pricing:savings', { amount: pricing.savings })}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        {t(`pricing:${feature}`)}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    onClick={handleBuyPremium}
                    size="lg"
                    variant={premiumStatus.hasPremium ? "outline" : "default"}
                    disabled={premiumStatus.hasPremium}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    {premiumStatus.hasPremium ? t('pricing:currentPlan') : t('pricing:buyPremium')}
                  </Button>
                  
                  {premiumStatus.hasPremium && premiumStatus.message && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-800 dark:text-green-200 text-center">
                        {premiumStatus.message}
                      </p>
                      {premiumStatus.expiryDate && !premiumStatus.isDHL && (
                        <p className="text-xs text-green-600 dark:text-green-300 text-center mt-1">
                          {t('pricing:expiresOn', { date: new Date(premiumStatus.expiryDate).toLocaleDateString() })}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Auth Required Dialog */}
        <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('pricing:authRequired')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('pricing:authRequiredDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => {
                setShowAuthDialog(false);
                navigate('/register');
              }}>
                {t('pricing:goToRegistration')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout>
    </>
  );
};

export default Pricing;