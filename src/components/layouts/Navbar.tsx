
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  UserIcon, 
  LogOutIcon, 
  SearchIcon,
  Settings as SettingsIcon
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
  
  const isLandscapeMobile = isMobile && orientation === "landscape";
  const isPortraitMobile = isMobile && orientation === "portrait";

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

  useEffect(() => {
    if (user) {
      refreshAdminStatus();
    }
  }, [user, refreshAdminStatus]);

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

  // Optimalizované rozměry pro různé mobile módy
  const navbarHeight = isLandscapeMobile ? 'h-12' : 'h-16';
  const menuButtonClass = isPortraitMobile 
    ? "p-3 min-h-[44px] min-w-[44px]" 
    : isLandscapeMobile 
      ? "p-2 min-h-[36px] min-w-[36px]" 
      : "";

  return (
    <>
      <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${isScrolled ? 'bg-card shadow-sm' : 'bg-card'} border-b border-border`}>
        <div className={`${navbarHeight} px-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size={isLandscapeMobile ? "sm" : "icon"}
              className={`lg:hidden ${menuButtonClass}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              data-menu-trigger="true"
            >
              <Menu className={isLandscapeMobile ? "h-4 w-4" : "h-5 w-5"} />
              <span className="sr-only">Toggle menu</span>
            </Button>
            
            {/* Desktop search bar */}
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
            
            {/* Mobile search button - optimalizovaný */}
            <Button 
              variant="ghost" 
              size={isLandscapeMobile ? "sm" : "icon"}
              className={`md:hidden ${isPortraitMobile ? "min-h-[44px] min-w-[44px] p-2" : "p-1"}`}
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon className={isLandscapeMobile ? "h-4 w-4" : "h-5 w-5"} />
              <span className="sr-only">Hledat</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Theme toggle button (viditelné pouze na desktop) */}
            {!isMobile && <ThemeToggle />}
            
            {/* Right Content (e.g. notifications) - optimized for mobile */}
            <div className="flex items-center gap-1">
              {rightContent}
            </div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`${
                      isMobile 
                        ? isLandscapeMobile 
                          ? 'p-1 min-h-[36px] min-w-[36px]' 
                          : 'p-2 min-h-[44px] min-w-[44px]'
                        : 'gap-2 px-3'
                    }`}
                  >
                    <div className={`rounded-full bg-primary/20 flex items-center justify-center text-foreground ${
                      isLandscapeMobile ? 'w-5 h-5' : isPortraitMobile ? 'w-7 h-7' : 'w-8 h-8'
                    }`}>
                      <UserIcon className={isLandscapeMobile ? "h-3 w-3" : isPortraitMobile ? "h-4 w-4" : "h-4 w-4"} />
                    </div>
                    
                    {/* Na mobilu skrýt text a badges */}
                    {!isMobile && (
                      <>
                        <span className="hidden sm:inline font-medium text-sm">
                          {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
                        </span>
                        {isPremium && <Badge className="bg-amber-500 text-xs">Premium</Badge>}
                        {isAdmin && <Badge className="bg-red-500 text-xs">Admin</Badge>}
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-50 bg-background border">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-medium">
                      {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                    {/* Na mobilu zobrazit badges v dropdown */}
                    {isMobile && (
                      <div className="flex gap-1 mt-1">
                        {isPremium && <Badge className="bg-amber-500 text-xs">Premium</Badge>}
                        {isAdmin && <Badge className="bg-red-500 text-xs">Admin</Badge>}
                      </div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Na mobilu přidat Theme Toggle do menu */}
                  {isMobile && (
                    <>
                      <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        <span className="flex-1">Vzhled</span>
                        <ThemeToggle alwaysShow={true} size="sm" variant="ghost" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
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
                <Button 
                  variant="ghost" 
                  asChild 
                  size={isLandscapeMobile ? "sm" : "default"}
                  className={isPortraitMobile ? "text-sm px-3" : ""}
                >
                  <Link to="/login">Přihlásit se</Link>
                </Button>
                <Button 
                  asChild 
                  size={isLandscapeMobile ? "sm" : "default"}
                  className={isPortraitMobile ? "text-sm px-3" : ""}
                >
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
