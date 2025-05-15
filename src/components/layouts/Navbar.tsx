
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  UserIcon, 
  LogOutIcon, 
  SearchIcon,
  CalculatorIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  toggleSidebar: () => void;
  rightContent?: React.ReactNode;
  sidebarOpen?: boolean;
}

const Navbar = ({ toggleSidebar, rightContent, sidebarOpen = false }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isPremium, signOut } = useAuth();

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}`}>
      <div className="h-16 px-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={(e) => {
              e.stopPropagation(); // Zabraňuje šíření události kliku
              toggleSidebar();
            }}
            data-menu-trigger="true" // Pro detekci kliknutí na toto tlačítko
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <div className="relative hidden md:flex items-center">
            <SearchIcon className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Hledat..."
              className="pl-8 bg-slate-50 border-none w-[200px] lg:w-[300px]"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Calculator Link - only visible when logged in */}
          {user && (
            <Button 
              variant="ghost" 
              className="text-sm font-medium flex items-center gap-2 hidden md:flex" 
              onClick={() => navigate("/calculator")}
            >
              <CalculatorIcon className="h-4 w-4" />
              <span>Kalkulačky</span>
            </Button>
          )}
          
          {/* Right Content (e.g. notifications) */}
          {rightContent}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
                  </span>
                  {isPremium && <Badge className="bg-amber-500">Premium</Badge>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Můj účet</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                {/* Calculator dropdown item - only visible when logged in on mobile */}
                <DropdownMenuItem onClick={() => navigate("/calculator")} className="md:hidden">
                  <CalculatorIcon className="mr-2 h-4 w-4" />
                  <span>Kalkulačky</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Odhlásit se</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate("/login")}>
              Přihlásit se
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
