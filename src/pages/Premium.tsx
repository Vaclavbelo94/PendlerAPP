
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckIcon, CreditCard, Settings, RefreshCw, Crown, AlertCircle, Eye, EyeOff, Sparkles, Zap, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStripePayments } from "@/hooks/useStripePayments";
import PromoCodeRedemption from "@/components/premium/PromoCodeRedemption";
import PeriodSelector, { PaymentPeriod } from "@/components/premium/PeriodSelector";
import { toast } from "sonner";

const Premium = () => {
  const { user, isPremium } = useAuth();
  const { 
    isLoading, 
    isCheckingSubscription, 
    handleCheckout, 
    checkSubscriptionStatus, 
    openCustomerPortal 
  } = useStripePayments();
  
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PaymentPeriod>('yearly');

  useEffect(() => {
    // Get premium expiry from localStorage as fallback
    try {
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (userData.premiumUntil) {
          setPremiumUntil(userData.premiumUntil);
        }
      }
    } catch (e) {
      console.error('Error checking premium status expiry:', e);
    }

    if (user && isPremium) {
      handleRefreshSubscription();
    }
  }, [isPremium, user]);

  const handleRefreshSubscription = async () => {
    const data = await checkSubscriptionStatus();
    if (data) {
      setSubscriptionData(data);
    }
  };

  const handleUpgrade = () => {
    handleCheckout(selectedPeriod);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('cs-CZ');
    } catch (e) {
      return 'Neznámé datum';
    }
  };

  const getSubscriptionEndDate = () => {
    if (subscriptionData?.subscription_end) {
      return formatDate(subscriptionData.subscription_end);
    }
    if (premiumUntil) {
      return formatDate(premiumUntil);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
      
      <div className="relative container py-8 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl shadow-lg mb-4"
            >
              <Crown className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Premium funkce
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Odemkněte plný potenciál aplikace s prémiovými funkcemi
            </p>
          </div>
          
          {/* Premium Status Alert */}
          {isPremium ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert className="border-green-500/20 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
                <Crown className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <strong>Máte aktivní premium předplatné!</strong>
                      {getSubscriptionEndDate() && (
                        <p className="text-sm mt-1">Platné do: {getSubscriptionEndDate()}</p>
                      )}
                      {subscriptionData?.subscription_tier && (
                        <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                          {subscriptionData.subscription_tier}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefreshSubscription}
                        disabled={isCheckingSubscription}
                        className="flex items-center justify-center bg-white/80"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isCheckingSubscription ? 'animate-spin' : ''}`} />
                        Obnovit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openCustomerPortal}
                        disabled={isLoading}
                        className="flex items-center justify-center bg-white/80"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Spravovat
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert className="border-amber-500/20 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
                <Eye className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <div className="space-y-2">
                    <strong>Reklamy v základní verzi</strong>
                    <p className="text-sm">
                      Základní verze aplikace obsahuje reklamy, které pomáhají financovat vývoj aplikace. 
                      S Premium předplatným získáte aplikaci zcela bez reklam.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Period Selector and Promo Code */}
          {!isPremium && user && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <PeriodSelector 
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
              />
              <PromoCodeRedemption />
            </motion.div>
          )}

          {/* Login Alert */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Alert className="border-blue-500/20 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Přihlašte se pro aktivaci premium funkcí</strong>
                  <p className="text-sm mt-1">
                    Pro nákup premium předplatného nebo uplatnění promo kódu se prosím nejdříve přihlaste.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => window.location.href = '/login'}>
                      Přihlásit se
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/register'}>
                      Registrovat se
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          {/* Pricing Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <PremiumFeatureCard 
              title="Základní"
              description="Základní funkce s reklamami"
              price="Zdarma"
              features={[
                "Základní překladač",
                "Jednoduchá kalkulačka", 
                "Kalendář směn",
                "Omezený počet slovíček",
                "Zobrazení reklam"
              ]}
              current={!isPremium}
              adNote="S reklamami"
            />
            
            <PremiumFeatureCard 
              title="Premium"
              description="Rozšířené funkce bez reklam"
              price={selectedPeriod === 'yearly' ? "990 Kč / rok" : "99 Kč / měsíc"}
              features={[
                "Neomezený překladač",
                "Pokročilé kalkulačky",
                "Neomezený počet slovíček",
                "Offline přístup ke slovíčkům",
                "Pokročilé grafy a statistiky",
                "Žádné reklamy",
                "Přednostní podpora"
              ]}
              current={isPremium}
              recommended
              onUpgrade={user && !isPremium ? handleUpgrade : undefined}
              isLoading={isLoading}
              periodBadge={selectedPeriod === 'yearly' ? "17% úspora" : undefined}
              noAds
            />
            
            <PremiumFeatureCard 
              title="Firemní"
              description="Pro firmy a týmy pendlerů"
              price="Individuální"
              features={[
                "Vše z Premium plánu",
                "Správa více uživatelů",
                "Sdílené slovníky a překlady",
                "API přístup",
                "Vlastní branding",
                "Prioritní podpora 24/7"
              ]}
              contactSales
              noAds
            />
          </motion.div>

          {/* Benefits Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl md:text-3xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  Proč si vybrat Premium?
                </CardTitle>
                <CardDescription className="text-lg">
                  Získejte maximum ze své cesty za prací v Německu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <motion.div 
                    className="space-y-4 text-center"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg">🚀 Produktivita</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Rychlejší překlady bez omezení</li>
                      <li>• Pokročilé kalkulačky pro plánování</li>
                      <li>• Offline přístup k důležitým funkcím</li>
                    </ul>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-4 text-center"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg">📈 Analýzy</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Detailní statistiky vašich cest</li>
                      <li>• Grafy úspor a výdajů</li>
                      <li>• Sledování pokroku v němčině</li>
                    </ul>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-4 text-center"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                      <EyeOff className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg flex items-center justify-center gap-2">
                      <EyeOff className="h-5 w-5 text-green-600" />
                      Bez reklam
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Žádné rušivé bannery</li>
                      <li>• Žádné popup reklamy</li>
                      <li>• Čistý zážitek z používání</li>
                      <li>• Rychlejší načítání stránek</li>
                    </ul>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

interface PremiumFeatureCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  current?: boolean;
  recommended?: boolean;
  contactSales?: boolean;
  onUpgrade?: () => void;
  isLoading?: boolean;
  periodBadge?: string;
  adNote?: string;
  noAds?: boolean;
}

const PremiumFeatureCard = ({
  title,
  description,
  price,
  features,
  current,
  recommended,
  contactSales,
  onUpgrade,
  isLoading,
  periodBadge,
  adNote,
  noAds,
}: PremiumFeatureCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={`relative h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden ${
        recommended ? 'ring-2 ring-yellow-400/50 shadow-yellow-100' : ''
      } ${current ? 'ring-2 ring-green-400/50 shadow-green-100' : ''}`}>
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${
          recommended ? 'from-yellow-50/50 to-amber-50/50' : 
          current ? 'from-green-50/50 to-emerald-50/50' : 
          'from-gray-50/50 to-slate-50/50'
        }`} />
        
        {/* Badges */}
        {recommended && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              Doporučeno
            </Badge>
          </div>
        )}
        
        {current && (
          <div className="absolute -top-3 right-4 z-10">
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg">
              Váš plán
            </Badge>
          </div>
        )}

        {noAds && (
          <div className="absolute -top-3 left-4 z-10">
            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-lg">
              <EyeOff className="h-3 w-3 mr-1" />
              Bez reklam
            </Badge>
          </div>
        )}
        
        <div className="relative">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {price}
              </span>
              {periodBadge && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  {periodBadge}
                </Badge>
              )}
              {adNote && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                  {adNote}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="flex-1">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm leading-relaxed">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter className="pt-6">
            {current ? (
              <Button variant="outline" className="w-full" disabled>
                Aktuální plán
              </Button>
            ) : contactSales ? (
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Kontaktujte nás
              </Button>
            ) : onUpgrade ? (
              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 shadow-lg" 
                onClick={onUpgrade}
                disabled={isLoading}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isLoading ? 'Načítání...' : 'Vybrat plán'}
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                Vyžaduje přihlášení
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

export default Premium;
