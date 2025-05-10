
import { ShieldIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PremiumFeatureAlertProps {
  featureName: string;
}

export const PremiumFeatureAlert = ({ featureName }: PremiumFeatureAlertProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg bg-muted p-6 border border-amber-200 flex flex-col items-center text-center space-y-4">
      <ShieldIcon className="h-12 w-12 text-amber-500" />
      <h3 className="text-xl font-semibold">Premium funkce</h3>
      <p className="text-muted-foreground max-w-md">
        Funkce <strong>{featureName}</strong> je dostupná pouze pro uživatele s Premium účtem.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button 
          onClick={() => navigate("/login")} 
          variant="default"
        >
          Přihlásit se
        </Button>
        <Button 
          onClick={() => navigate("/register")} 
          variant="outline"
        >
          Registrovat účet
        </Button>
      </div>
    </div>
  );
};

export default PremiumFeatureAlert;
