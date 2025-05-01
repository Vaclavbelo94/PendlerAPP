
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, LogOut, UserRound } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status when the component mounts or route changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
          setUserName(currentUser.name || "");
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    checkLoginStatus();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

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
          <Link to="/translator" className="text-foreground font-medium text-sm hover:text-primary transition-colors">
            Překladač
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
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{userName}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Odhlásit se
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate("/login")}>
              Přihlásit se
            </Button>
          )}
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
                to="/translator" 
                className="text-foreground font-medium text-sm hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Překladač
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
              
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <UserRound className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{userName}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Odhlásit se
                  </Button>
                </>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Přihlásit se
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
