
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  UserIcon, 
  LogOutIcon, 
  SearchIcon
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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "sonner";
import GlobalSearch from "@/components/search/GlobalSearch";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";

interface NavbarProps {
  toggleSidebar: () => void;
  rightContent?: React.ReactNode;
  sidebarOpen?: boolean;
}

const Navbar = ({ toggleSidebar, rightContent, sidebarOpen = false }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isPremium, isAdmin, signOut, refreshAdminStatus } = useAuth();
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  
  // Určit, zda je v landscape módu na mobilním zařízení
  const isLandscapeMobile = isMobile && orientation === "landscape";

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

  // Refresh admin status on component mount
  useEffect(() => {
    if (user) {
      refreshAdminStatus();
    }
  }, [user, refreshAdminStatus]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    toast.success("Odhlášení proběhlo úspěšně");
  };

  // Dynamická výška navbar na základě landscape mobile módu
  const navbarHeight = isLandscapeMobile ? 'h-12' : 'h-16';

  return (
    <>
      <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${isScrolled ? 'bg-card shadow-sm' : 'bg-card'}`}>
        <div className={`${navbarHeight} px-4 border-b border-border flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size={isLandscapeMobile ? "sm" : "icon"}
              className="lg:hidden" 
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              data-menu-trigger="true"
            >
              <Menu className={isLandscapeMobile ? "h-4 w-4" : "h-5 w-5"} />
              <span className="sr-only">Toggle menu</span>
            </Button>
            
            <div className="relative hidden md:flex items-center">
              <SearchIcon className={`absolute left-2.5 text-muted-foreground ${isLandscapeMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
              <Input
                type="search"
                placeholder="Hledat... (Ctrl+K)"
                className={`pl-8 bg-muted border-none cursor-pointer ${
                  isLandscapeMobile 
                    ? 'w-[150px] lg:w-[200px] h-8 text-sm' 
                    : 'w-[200px] lg:w-[300px]'
                }`}
                onClick={() => setSearchOpen(true)}
                readOnly
              />
            </div>
            
            {/* Mobile search button */}
            <Button 
              variant="ghost" 
              size={isLandscapeMobile ? "sm" : "icon"}
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon className={isLandscapeMobile ? "h-4 w-4" : "h-5 w-5"} />
              <span className="sr-only">Hledat</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme toggle button (viditelné pouze na desktop) */}
            <ThemeToggle />
            
            {/* Right Content (e.g. notifications) */}
            {rightContent}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`gap-2 ${isLandscapeMobile ? 'px-2' : ''}`}>
                    <div className={`rounded-full bg-primary/20 flex items-center justify-center text-foreground ${
                      isLandscapeMobile ? 'w-6 h-6' : 'w-7 h-7'
                    }`}>
                      <UserIcon className={isLandscapeMobile ? "h-3 w-3" : "h-4 w-4"} />
                    </div>
                    <span className={`hidden sm:inline font-medium ${isLandscapeMobile ? 'text-xs' : 'text-sm'}`}>
                      {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
                    </span>
                    {/* Skrýt badges v landscape mobile módu pro úsporu místa */}
                    {!isLandscapeMobile && isPremium && <Badge className="bg-amber-500">Premium</Badge>}
                    {!isLandscapeMobile && isAdmin && <Badge className="bg-red-500">Admin</Badge>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Můj účet</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Odhlásit se</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild size={isLandscapeMobile ? "sm" : "default"}>
                  <Link to="/login">Přihlásit se</Link>
                </Button>
                <Button asChild size={isLandscapeMobile ? "sm" : "default"}>
                  <Link to="/register">Registrovat se</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Navbar;
