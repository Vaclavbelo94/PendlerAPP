
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col py-16 bg-slate-50">
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-2xl font-semibold mb-2">Stránka nenalezena</p>
            <p className="text-muted-foreground mb-8">
              Omlouváme se, ale stránka, kterou hledáte, neexistuje nebo byla přesunuta.
            </p>
            <Button asChild size="lg">
              <Link to="/">
                Zpět na hlavní stránku
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
