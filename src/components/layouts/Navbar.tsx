
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Car, Languages } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-roboto font-bold text-xl text-primary">Pendler Helper</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/language" className="text-foreground font-medium text-sm hover:text-primary transition-colors">
            Výuka němčiny
          </Link>
          <Link to="/laws" className="text-foreground font-medium text-sm hover:text-primary transition-colors">
            Přehled zákonů
          </Link>
          <Link to="/vehicle" className="text-foreground font-medium text-sm hover:text-primary transition-colors">
            Správa vozidla
          </Link>
          <Link to="/shifts" className="text-foreground font-medium text-sm hover:text-primary transition-colors">
            Plánování směn
          </Link>
          <Button variant="default" size="sm">
            Přihlásit se
          </Button>
        </nav>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/language" 
                className="text-foreground font-medium text-sm hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Výuka němčiny
              </Link>
              <Link 
                to="/laws" 
                className="text-foreground font-medium text-sm hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Přehled zákonů
              </Link>
              <Link 
                to="/vehicle" 
                className="text-foreground font-medium text-sm hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Správa vozidla
              </Link>
              <Link 
                to="/shifts" 
                className="text-foreground font-medium text-sm hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Plánování směn
              </Link>
              <Button variant="default" size="sm" className="w-full">
                Přihlásit se
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
