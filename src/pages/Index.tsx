
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Benefits from "@/components/home/Benefits";
import AppShowcase from "@/components/home/AppShowcase";
import CTA from "@/components/home/CTA";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

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
