
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  toggleSidebar?: () => void;
  rightContent?: React.ReactNode;
  sidebarOpen?: boolean;
}

const Navbar = ({ toggleSidebar, rightContent, sidebarOpen }: NavbarProps) => {
  const { user, signOut, isPremium } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const NavLinks = ({ mobile = false, onLinkClick = () => {} }) => (
    <>
      <Link
        to="/dashboard"
        className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-primary transition-colors`}
        onClick={onLinkClick}
      >
        Dashboard
      </Link>
      <Link
        to="/vocabulary"
        className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-primary transition-colors`}
        onClick={onLinkClick}
      >
        Slovní zásoba
      </Link>
      <Link
        to="/calculator"
        className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-primary transition-colors`}
        onClick={onLinkClick}
      >
        Kalkulačky
      </Link>
      <Link
        to="/translator"
        className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-primary transition-colors`}
        onClick={onLinkClick}
      >
        Překladač
      </Link>
      <Link
        to="/lessons"
        className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-primary transition-colors`}
        onClick={onLinkClick}
      >
        Lekce
      </Link>
      <Link
        to="/premium"
        className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-primary transition-colors flex items-center gap-1`}
        onClick={onLinkClick}
      >
        <Crown className="h-4 w-4 text-yellow-500" />
        Premium
        {isPremium && <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Active</span>}
      </Link>
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PA</span>
              </div>
              <span className="font-semibold text-lg">PendlerApp</span>
            </Link>

            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <NavLinks />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {rightContent}
            
            {user ? (
              <>
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.email}</p>
                          {isPremium && (
                            <div className="flex items-center gap-1">
                              <Crown className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs text-muted-foreground">Premium</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/premium')}>
                        <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                        Premium
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Odhlásit se
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="md:hidden">
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <div className="flex flex-col space-y-4 mt-4">
                        <div className="flex items-center gap-2 pb-4 border-b">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {user.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.email}</p>
                            {isPremium && (
                              <div className="flex items-center gap-1">
                                <Crown className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs text-muted-foreground">Premium</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <NavLinks mobile onLinkClick={() => setIsOpen(false)} />
                        <Button variant="outline" onClick={() => { navigate('/profile'); setIsOpen(false); }}>
                          <User className="mr-2 h-4 w-4" />
                          Profil
                        </Button>
                        <Button variant="outline" onClick={handleSignOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Odhlásit se
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Přihlásit se
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Registrovat se
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
