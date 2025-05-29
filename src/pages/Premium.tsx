
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckIcon, CreditCard, Settings, RefreshCw, Crown, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStripePayments } from "@/hooks/useStripePayments";
import PromoCodeRedemption from "@/components/premium/PromoCodeRedemption";
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

    // Check subscription status on mount
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
    <div className="container py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Premium funkce</h1>
          <p className="text-muted-foreground">
            Odemkněte plný potenciál aplikace s prémiovými funkcemi
          </p>
        </div>
        
        {isPremium && (
          <Alert className="border-green-500/20 bg-green-50 dark:bg-green-900/10">
            <Crown className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Máte aktivní premium předplatné!</strong>
                  {getSubscriptionEndDate() && (
                    <p className="text-sm mt-1">
                      Platné do: {getSubscriptionEndDate()}
                    </p>
                  )}
                  {subscriptionData?.subscription_tier && (
                    <Badge variant="secondary" className="mt-1">
                      {subscriptionData.subscription_tier}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshSubscription}
                    disabled={isCheckingSubscription}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${isCheckingSubscription ? 'animate-spin' : ''}`} />
                    Obnovit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openCustomerPortal}
                    disabled={isLoading}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Spravovat
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!isPremium && user && (
          <PromoCodeRedemption />
        )}

        {!user && (
          <Alert className="border-blue-500/20 bg-blue-50 dark:bg-blue-900/10">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
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
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PremiumFeatureCard 
            title="Základní"
            description="Základní funkce pro všechny uživatele"
            price="Zdarma"
            features={[
              "Základní překladač",
              "Jednoduchá kalkulačka",
              "Kalendář směn",
              "Omezený počet slovíček"
            ]}
            current={!isPremium}
          />
          
          <PremiumFeatureCard 
            title="Premium"
            description="Rozšířené funkce pro náročné uživatele"
            price="99 Kč / měsíc"
            features={[
              "Neomezený překladač",
              "Pokročilé kalkulačky",
              "Neomezený počet slovíček",
              "Offline přístup ke slovíčkům",
              "Pokročilé grafy a statistiky",
              "Přednostní podpora"
            ]}
            current={isPremium}
            recommended
            onUpgrade={user && !isPremium ? handleCheckout : undefined}
            isLoading={isLoading}
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
          />
        </div>

        {/* Přehled výhod Premium */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Proč si vybrat Premium?
            </CardTitle>
            <CardDescription>
              Získejte maximum ze své cesty za prací v Německu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">🚀 Produktivita</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Rychlejší překlady bez omezení</li>
                  <li>• Pokročilé kalkulačky pro plánování</li>
                  <li>• Offline přístup k důležitým funkcím</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">📈 Analýzy</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Detailní statistiky vašich cest</li>
                  <li>• Grafy úspor a výdajů</li>
                  <li>• Sledování pokroku v němčině</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
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
}: PremiumFeatureCardProps) => {
  return (
    <Card className={`relative ${recommended ? 'border-primary shadow-md' : ''} ${current ? 'bg-accent/50' : ''}`}>
      {recommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="bg-primary text-primary-foreground">
            Doporučeno
          </Badge>
        </div>
      )}
      
      {current && (
        <div className="absolute -top-3 right-4">
          <Badge variant="secondary">
            Váš plán
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-2">
          <span className="text-2xl font-bold">{price}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        {current ? (
          <Button variant="outline" className="w-full" disabled>
            Aktuální plán
          </Button>
        ) : contactSales ? (
          <Button variant="outline" className="w-full">
            Kontaktujte nás
          </Button>
        ) : onUpgrade ? (
          <Button 
            className="w-full" 
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
    </Card>
  );
};

export default Premium;
