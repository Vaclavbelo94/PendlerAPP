
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
import { CheckIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PromoCodeRedemption from "@/components/premium/PromoCodeRedemption";

const Premium = () => {
  const { user, isPremium } = useAuth();
  const [premiumUntil, setPremiumUntil] = useState<string | null>(null);

  useEffect(() => {
    // Get premium expiry from localStorage
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
  }, [isPremium]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return 'Neznámé datum';
    }
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
          <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg text-center">
            <h2 className="text-xl font-medium text-green-600 dark:text-green-400">
              Máte aktivní premium předplatné!
            </h2>
            {premiumUntil && (
              <p className="text-sm text-muted-foreground mt-1">
                Platné do: {formatDate(premiumUntil)}
              </p>
            )}
          </div>
        )}

        {!isPremium && user && (
          <PromoCodeRedemption />
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
}

const PremiumFeatureCard = ({
  title,
  description,
  price,
  features,
  current,
  recommended,
  contactSales,
}: PremiumFeatureCardProps) => {
  return (
    <Card className={`relative ${recommended ? 'border-primary shadow-md' : ''}`}>
      {recommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="bg-primary text-primary-foreground">
            Doporučeno
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
        ) : (
          <Button className="w-full">
            Vybrat plán
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Premium;
