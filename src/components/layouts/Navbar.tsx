
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  UserIcon, 
  LogOutIcon, 
  BellIcon,
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

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
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

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  return (
    <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}`}>
      <div className="h-16 px-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
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
          {isLoggedIn && (
            <Button 
              variant="ghost" 
              className="text-sm font-medium flex items-center gap-2 hidden md:flex" 
              onClick={() => navigate("/calculator")}
            >
              <CalculatorIcon className="h-4 w-4" />
              <span>Kalkulačky</span>
            </Button>
          )}
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{userName}</span>
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
