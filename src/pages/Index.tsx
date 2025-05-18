
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Benefits from "@/components/home/Benefits";
import AppShowcase from "@/components/home/AppShowcase";
import CTA from "@/components/home/CTA";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUnifiedPremiumStatus } from "@/hooks/useUnifiedPremiumStatus";
import { DiamondIcon } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { canAccess } = useUnifiedPremiumStatus();
  
  return (
    <div className="flex flex-col">
      <main className="flex-grow">
        {!user && (
          <div className="bg-primary text-primary-foreground py-3 px-4 text-center">
            <p className="flex items-center justify-center gap-2 text-sm sm:text-base">
              Nemáte ještě účet? 
              <Link to="/register">
                <Button variant="secondary" size="sm">
                  Registrujte se zdarma
                </Button>
              </Link>
            </p>
          </div>
        )}
        
        {user && !canAccess && (
          <div className="bg-amber-100 text-amber-800 py-3 px-4 text-center">
            <p className="flex items-center justify-center gap-2 text-sm sm:text-base">
              <DiamondIcon className="h-4 w-4" />
              Odemkněte všechny funkce s Premium 
              <Link to="/premium">
                <Button variant="default" size="sm" className="bg-amber-500 hover:bg-amber-600">
                  Aktivovat Premium
                </Button>
              </Link>
            </p>
          </div>
        )}
        
        <Hero />
        <Features />
        <Benefits />
        <AppShowcase />
        <CTA />
      </main>
    </div>
  );
};

export default Index;
