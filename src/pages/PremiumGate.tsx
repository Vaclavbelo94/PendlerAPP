import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Star, Zap, Shield, Rocket, Loader2, Gift, Sparkles, Eye, Users } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useStripePayments, PaymentPeriod } from '@/hooks/useStripePayments';
import PeriodSelector from '@/components/premium/PeriodSelector';
import { toast } from 'sonner';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { activatePromoCode } from '@/services/promoCodeService';
import { isDHLPromoCode } from '@/utils/dhlAuthUtils';
import { DHLSetupService } from '@/services/dhlSetupService';
import { useCurrencyFormatter } from '@/utils/currencyUtils';

interface PremiumGateProps {
  onContinueWithAds?: () => void;
  returnPath?: string;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ onContinueWithAds, returnPath }) => {
  const { user, refreshPremiumStatus, isPremium } = useAuth();
  const { t, i18n } = useTranslation(['premium', 'common']);
  const { formatCurrency } = useCurrencyFormatter();
  const { handleCheckout, isLoading: isCheckoutLoading } = useStripePayments();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [selectedPeriod, setSelectedPeriod] = useState<PaymentPeriod>('monthly');
  const [promoCode, setPromoCode] = useState("");
  const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);
  const [showPromoSection, setShowPromoSection] = useState(false);

  // Získání return path z URL parametrů nebo props
  const finalReturnPath = searchParams.get('returnPath') || returnPath || location.state?.returnPath || '/dashboard';
  const featureKey = searchParams.get('featureKey') || location.state?.featureKey;

  // Pokud už uživatel má premium, přesměruj zpět
  useEffect(() => {
    if (isPremium) {
      navigate(finalReturnPath);
    }
  }, [isPremium, navigate, finalReturnPath]);

  const currentLanguage = i18n.language;

  // Currency and pricing based on language
  const getPricingInfo = () => {
    switch (currentLanguage) {
      case 'pl':
        return {
          currency: 'PLN',
          monthlyPrice: 45,
          yearlyPrice: 450,
          savings: '17%'
        };
      case 'de':
        return {
          currency: 'EUR',
          monthlyPrice: 9.99,
          yearlyPrice: 99,
          savings: '17%'
        };
      default: // cs
        return {
          currency: 'CZK',
          monthlyPrice: 249,
          yearlyPrice: 2490,
          savings: '17%'
        };
    }
  };

  const pricing = getPricingInfo();

  const premiumFeatures = [
    {
      icon: Star,
      title: t('premium:features.unlimitedShifts', 'Neomezené směny'),
      description: t('premium:features.unlimitedShiftsDesc', 'Sledujte všechny své směny bez omezení')
    },
    {
      icon: Zap,
      title: t('premium:features.advancedStatistics', 'Pokročilé statistiky'),
      description: t('premium:features.advancedStatisticsDesc', 'Detailní analytika vašich směn')
    },
    {
      icon: Shield,
      title: t('premium:features.prioritySupport', 'Prioritní podpora'),
      description: t('premium:features.prioritySupportDesc', 'Rychlejší řešení problémů')
    },
    {
      icon: Rocket,
      title: t('premium:features.dataExport', 'Export dat'),
      description: t('premium:features.dataExportDesc', 'Exportujte data ve formátech PDF, Excel')
    }
  ];

  const handlePremiumActivation = async () => {
    try {
      await handleCheckout(selectedPeriod);
    } catch (error) {
      toast.error('Platba se nezdařila. Zkuste to prosím znovu.');
    }
  };

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !promoCode.trim()) {
      toast.error("Zadejte platný promo kód");
      return;
    }
    
    const isDHL = isDHLPromoCode(promoCode.trim());
    
    setIsSubmittingPromo(true);
    try {
      const result = await activatePromoCode(user.id, promoCode.trim());
      
      if (!result.success) {
        toast.error(result.message || "Neplatný promo kód");
        return;
      }
      
      const redemptionCode = result.promoCode;
      if (!redemptionCode) {
        toast.error("Nastala chyba při získávání informací o promo kódu");
        return;
      }

      // Refresh premium status after successful redemption
      await refreshPremiumStatus();
      
      if (isDHL) {
        // Ensure DHL employee setup
        await DHLSetupService.ensureDHLPromoRedemption(user.id);
        
        toast.success(`DHL Premium aktivován na rok!`, {
          description: `Promo kód ${redemptionCode.code} byl úspěšně aktivován.`,
          duration: 5000
        });
        
        // Redirect to DHL setup after short delay
        setTimeout(() => {
          navigate('/dhl-setup');
        }, 2000);
        
      } else if (redemptionCode.discount === 100) {
        const premiumExpiry = new Date();
        premiumExpiry.setMonth(premiumExpiry.getMonth() + redemptionCode.duration);
        toast.success(`Premium status byl aktivován do ${premiumExpiry.toLocaleDateString('cs-CZ')}`, {
          duration: 5000
        });
        
        // Navigate back to return path or dashboard
        setTimeout(() => {
          navigate(finalReturnPath);
        }, 2000);
      } else {
        toast.success(`Promo kód byl použit se slevou ${redemptionCode.discount}%`, {
          duration: 5000
        });
      }
      
    } catch (error) {
      console.error("Error redeeming promo code", error);
      toast.error("Nastala chyba při aktivaci promo kódu");
    } finally {
      setIsSubmittingPromo(false);
      setPromoCode("");
    }
  };

  const handleContinueWithAds = () => {
    if (onContinueWithAds) {
      onContinueWithAds();
    } else {
      navigate(finalReturnPath);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Odemkněte Premium funkce
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Získejte přístup ke všem funkcím aplikace bez reklam a s prioritní podporou
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Premium Purchase Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Crown className="h-6 w-6 text-primary" />
                  Předplatné Premium
                </CardTitle>
                <CardDescription>
                  Získejte okamžitý přístup ke všem funkcím
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <PeriodSelector 
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                  pricing={pricing}
                />
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {formatCurrency(selectedPeriod === 'monthly' ? pricing.monthlyPrice : pricing.yearlyPrice)}
                    <span className="text-sm text-muted-foreground ml-1">
                      {selectedPeriod === 'monthly' ? '/měsíc' : '/rok'}
                    </span>
                  </div>
                  
                  {selectedPeriod === 'yearly' && (
                    <p className="text-sm text-green-600 mb-4">
                      Ušetříte {pricing.savings}
                    </p>
                  )}
                  
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handlePremiumActivation}
                    disabled={isCheckoutLoading}
                  >
                    {isCheckoutLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Zpracovává se...
                      </>
                    ) : (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Aktivovat Premium
                      </>
                    )}
                  </Button>
                </div>

                {/* Premium Features */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-center">Co získáte:</h3>
                  <div className="space-y-2">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
                        <feature.icon className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="text-sm">
                          <span className="font-medium">{feature.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Alternative Options Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Promo Code Section */}
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <Gift className="h-5 w-5" />
                  Máte promo kód?
                </CardTitle>
                <CardDescription>
                  Aktivujte premium funkcím pomocí promo kódu
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showPromoSection ? (
                  <Button 
                    variant="outline" 
                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300"
                    onClick={() => setShowPromoSection(true)}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Zadat promo kód
                  </Button>
                ) : (
                  <form onSubmit={handleRedeemCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-code">Promo kód</Label>
                      <Input
                        id="promo-code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Zadejte váš promo kód (např. DHL2026)"
                        disabled={isSubmittingPromo}
                        className="bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={isSubmittingPromo || !promoCode.trim()}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isSubmittingPromo ? "Aktivuji..." : "Aktivovat"}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowPromoSection(false)}
                        className="border-amber-300"
                      >
                        Zrušit
                      </Button>
                    </div>
                  </form>
                )}
                
                <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    <strong>Tip:</strong> Kód DHL2026 aktivuje roční premium a přístup k DHL funkcím.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Continue with Ads */}
            <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-background dark:from-slate-950/20 dark:to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Eye className="h-5 w-5" />
                  Pokračovat s reklamami
                </CardTitle>
                <CardDescription>
                  Používejte aplikaci zdarma s občasnými reklamami
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Základní funkce zdarma</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContinueWithAds}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Pokračovat s reklamami
                  </Button>
                </div>
                
                <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Můžete kdykoli upgradovat na Premium pro zlepšený zážitek bez reklam.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate;