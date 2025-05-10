
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, ShieldIcon } from "lucide-react";
import { toast } from "sonner";

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
          <div className="inline-block p-3 bg-amber-100 rounded-full mb-4">
            <ShieldIcon className="h-12 w-12 text-amber-500" />
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
            onActivate={() => activatePremium(12)}
          />
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

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  onActivate: () => void;
}

const PricingCard = ({
  title,
  price,
  period,
  description,
  features,
  highlighted = false,
  onActivate
}: PricingCardProps) => {
  return (
    <Card className={`flex flex-col ${highlighted ? 'border-amber-300 shadow-lg' : ''}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground"> {period}</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-green-500" />
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
          Aktivovat
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Premium;
