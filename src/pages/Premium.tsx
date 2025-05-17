
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, DiamondIcon, StarIcon, ShieldIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Premium = () => {
  const navigate = useNavigate();

  const activatePremium = (months: number) => {
    try {
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }

      // Get current user
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      
      // Get all users
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = allUsers.findIndex((u: any) => u.email === currentUser.email);
      
      if (userIndex === -1) {
        toast.error("Uživatel nenalezen");
        return;
      }

      // Calculate expiry date
      const now = new Date();
      const expiry = new Date();
      expiry.setMonth(now.getMonth() + months);

      // Update user
      allUsers[userIndex] = {
        ...allUsers[userIndex],
        isPremium: true,
        premiumExpiry: expiry.toISOString(),
      };

      // Update localStorage
      localStorage.setItem("users", JSON.stringify(allUsers));
      localStorage.setItem("currentUser", JSON.stringify({
        ...currentUser,
        isPremium: true,
        premiumExpiry: expiry.toISOString(),
      }));

      toast.success(`Premium účet aktivován na ${months} ${months === 1 ? 'měsíc' : months < 5 ? 'měsíce' : 'měsíců'}!`);
      navigate("/profile");
    } catch (error) {
      console.error("Error activating premium:", error);
      toast.error("Chyba při aktivaci Premium účtu");
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mb-4 shadow-md">
            <DiamondIcon className="h-12 w-12 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Aktivujte Premium účet</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Získejte přístup ke všem premium funkcím aplikace a využívejte
            plný potenciál všech nástrojů.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Monthly Plan */}
          <PricingCard
            title="Měsíční"
            price="149 Kč"
            period="měsíčně"
            description="Ideální pro krátkodobé použití"
            features={[
              "Plánování směn",
              "Pokročilý překladač",
              "Daňové kalkulačky",
              "Rozšířené materiály k němčině",
              "Správa vozidla"
            ]}
            onActivate={() => activatePremium(1)}
          />

          {/* 3-Month Plan */}
          <PricingCard
            title="Čtvrtletní"
            price="399 Kč"
            period="na 3 měsíce"
            description="Ušetříte 11% oproti měsíčnímu"
            features={[
              "Plánování směn",
              "Pokročilý překladač",
              "Daňové kalkulačky",
              "Rozšířené materiály k němčině",
              "Správa vozidla"
            ]}
            highlighted={true}
            badgeText="Nejoblíbenější"
            onActivate={() => activatePremium(3)}
          />

          {/* Annual Plan */}
          <PricingCard
            title="Roční"
            price="1499 Kč"
            period="ročně"
            description="Ušetříte 16% oproti měsíčnímu"
            features={[
              "Plánování směn",
              "Pokročilý překladač",
              "Daňové kalkulačky",
              "Rozšířené materiály k němčině",
              "Správa vozidla"
            ]}
            badgeText="Nejlepší hodnota"
            onActivate={() => activatePremium(12)}
          />
        </div>
        
        <div className="mt-12">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
              <DiamondIcon className="h-5 w-5 mr-2 text-amber-600" />
              Co získáte s Premium verzí
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <PremiumFeatureItem 
                title="Pokročilý překladač" 
                description="Profesionální překlady s možností ukládání historie a frází"
              />
              <PremiumFeatureItem 
                title="Daňové kalkulačky" 
                description="Kompletní sada nástrojů pro výpočet daní v Německu"
              />
              <PremiumFeatureItem 
                title="Rozšířený slovník" 
                description="Přístup k rozšířené databázi slovíček a frází"
              />
              <PremiumFeatureItem 
                title="Plánování směn" 
                description="Pokročilé nástroje pro správu a export pracovních směn"
              />
              <PremiumFeatureItem 
                title="Interaktivní výuka" 
                description="Přístup ke kvízům a gamifikačním prvkům výuky němčiny"
              />
              <PremiumFeatureItem 
                title="Prioritní podpora" 
                description="Přednostní přístup k zákaznické podpoře"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="link" onClick={() => navigate(-1)}>
            Zpět na předchozí stránku
          </Button>
        </div>
      </div>
    </div>
  );
};

interface PremiumFeatureItemProps {
  title: string;
  description: string;
}

const PremiumFeatureItem = ({ title, description }: PremiumFeatureItemProps) => {
  return (
    <div className="flex items-start">
      <div className="mt-1 p-1 bg-amber-200 rounded-full">
        <CheckIcon className="h-4 w-4 text-amber-700" />
      </div>
      <div className="ml-3">
        <h3 className="text-base font-medium text-amber-800">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badgeText?: string;
  onActivate: () => void;
}

const PricingCard = ({
  title,
  price,
  period,
  description,
  features,
  highlighted = false,
  badgeText,
  onActivate
}: PricingCardProps) => {
  return (
    <Card className={`flex flex-col relative ${
      highlighted 
        ? 'border-amber-300 shadow-lg shadow-amber-100/50 bg-gradient-to-br from-amber-50 to-white' 
        : ''
    }`}>
      {badgeText && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className={`${highlighted ? 'bg-amber-500' : 'bg-amber-400'} text-white border-none px-3`}>
            <StarIcon className="h-3.5 w-3.5 mr-1" />
            {badgeText}
          </Badge>
        </div>
      )}
      <CardHeader className={highlighted ? 'pb-2' : ''}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground"> {period}</span>
        </div>
        <ul className="space-y-2.5">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <div className={`p-1 rounded-full ${highlighted ? 'bg-amber-100' : 'bg-muted'}`}>
                <CheckIcon className={`h-3.5 w-3.5 ${highlighted ? 'text-amber-600' : 'text-green-500'}`} />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${highlighted ? 'bg-amber-500 hover:bg-amber-600' : ''}`} 
          onClick={onActivate}
        >
          {highlighted ? (
            <>
              <DiamondIcon className="mr-2 h-4 w-4" />
              Aktivovat
            </>
          ) : (
            "Aktivovat"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Premium;
