
import { ShieldIcon, LockIcon, DiamondIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PremiumFeatureAlertProps {
  featureName: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export const PremiumFeatureAlert = ({ 
  featureName, 
  description, 
  className = "", 
  compact = false 
}: PremiumFeatureAlertProps) => {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div className={`rounded-lg bg-amber-50 p-4 border border-amber-200 flex items-center justify-between ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-amber-100">
            <DiamondIcon className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">{featureName}</p>
            <p className="text-xs text-amber-600">Tato funkce vyžaduje Premium účet</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate("/premium")} 
          variant="outline"
          size="sm"
          className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300"
        >
          Aktivovat Premium
        </Button>
      </div>
    );
  }

  return (
    <div className={`rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 p-6 border border-amber-200 shadow-md flex flex-col items-center text-center space-y-4 ${className}`}>
      <div className="p-3 bg-amber-200 rounded-full">
        <DiamondIcon className="h-10 w-10 text-amber-600" />
      </div>
      <h3 className="text-xl font-semibold text-amber-800">Premium funkce</h3>
      <p className="text-muted-foreground max-w-md">
        Funkce <strong className="text-amber-700">{featureName}</strong> je dostupná pouze pro uživatele s Premium účtem.
        {description && <span className="block mt-2">{description}</span>}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button 
          onClick={() => navigate("/premium")} 
          variant="default"
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          <DiamondIcon className="mr-2 h-4 w-4" />
          Aktivovat Premium
        </Button>
        <Button 
          onClick={() => navigate("/login")} 
          variant="outline"
          className="border-amber-300 text-amber-800 hover:bg-amber-100"
        >
          Přihlásit se
        </Button>
      </div>
    </div>
  );
};

export default PremiumFeatureAlert;
