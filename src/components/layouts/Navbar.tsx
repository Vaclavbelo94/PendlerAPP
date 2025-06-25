
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Crown, Shield, Truck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { canAccessDHLFeatures, canAccessDHLAdmin } from "@/utils/dhlAuthUtils";
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
  const { user, signOut, isPremium, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Check DHL access
  const isDHLEmployee = canAccessDHLFeatures(user);
  const isDHLAdmin = canAccessDHLAdmin(user);

  // Debug admin status
  React.useEffect(() => {
    console.log('Navbar Debug - User:', user?.email);
    console.log('Navbar Debug - isAdmin:', isAdmin);
    console.log('Navbar Debug - isDHLEmployee:', isDHLEmployee);
    console.log('Navbar Debug - isDHLAdmin:', isDHLAdmin);
  }, [user, isAdmin, isDHLEmployee, isDHLAdmin]);

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
        to="/tax-advisor"
        className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-primary transition-colors`}
        onClick={onLinkClick}
      >
        Daňový poradce
      </Link>
      <Link
        to="/translator"
        className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-primary transition-colors`}
        onClick={onLinkClick}
      >
        Překladač
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
      {/* DHL Links */}
      {isDHLEmployee && (
        <Link
          to="/dhl-dashboard"
          className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-yellow-600 transition-colors flex items-center gap-1`}
          onClick={onLinkClick}
        >
          <Truck className="h-4 w-4 text-yellow-600" />
          DHL Dashboard
        </Link>
      )}
      {isDHLAdmin && (
        <Link
          to="/dhl-admin"
          className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-yellow-600 transition-colors flex items-center gap-1`}
          onClick={onLinkClick}
        >
          <Truck className="h-4 w-4 text-yellow-600" />
          DHL Admin
        </Link>
      )}
      {isAdmin && (
        <Link
          to="/admin"
          className={`${mobile ? 'block py-2' : ''} text-foreground hover:text-primary transition-colors flex items-center gap-1`}
          onClick={onLinkClick}
        >
          <Shield className="h-4 w-4 text-red-500" />
          Administrace
        </Link>
      )}
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
                          <div className="flex items-center gap-2">
                            {isPremium && (
                              <div className="flex items-center gap-1">
                                <Crown className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs text-muted-foreground">Premium</span>
                              </div>
                            )}
                            {isAdmin && (
                              <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3 text-red-500" />
                                <span className="text-xs text-muted-foreground">Admin</span>
                              </div>
                            )}
                            {isDHLEmployee && (
                              <div className="flex items-center gap-1">
                                <Truck className="h-3 w-3 text-yellow-600" />
                                <span className="text-xs text-muted-foreground">DHL</span>
                              </div>
                            )}
                          </div>
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
                      {/* DHL Dropdown Items */}
                      {isDHLEmployee && (
                        <DropdownMenuItem onClick={() => navigate('/dhl-dashboard')}>
                          <Truck className="mr-2 h-4 w-4 text-yellow-600" />
                          DHL Dashboard
                        </DropdownMenuItem>
                      )}
                      {isDHLAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/dhl-admin')}>
                          <Truck className="mr-2 h-4 w-4 text-yellow-600" />
                          DHL Admin
                        </DropdownMenuItem>
                      )}
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Shield className="mr-2 h-4 w-4 text-red-500" />
                          Administrace
                        </DropdownMenuItem>
                      )}
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
                            <div className="flex items-center gap-2">
                              {isPremium && (
                                <div className="flex items-center gap-1">
                                  <Crown className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs text-muted-foreground">Premium</span>
                                </div>
                              )}
                              {isAdmin && (
                                <div className="flex items-center gap-1">
                                  <Shield className="h-3 w-3 text-red-500" />
                                  <span className="text-xs text-muted-foreground">Admin</span>
                                </div>
                              )}
                              {isDHLEmployee && (
                                <div className="flex items-center gap-1">
                                  <Truck className="h-3 w-3 text-yellow-600" />
                                  <span className="text-xs text-muted-foreground">DHL</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <NavLinks mobile onLinkClick={() => setIsOpen(false)} />
                        
                        {/* Mobile DHL Buttons */}
                        {isDHLEmployee && (
                          <Button 
                            variant="outline" 
                            onClick={() => { navigate('/dhl-dashboard'); setIsOpen(false); }}
                            className="border-yellow-200 hover:bg-yellow-50"
                          >
                            <Truck className="mr-2 h-4 w-4 text-yellow-600" />
                            DHL Dashboard
                          </Button>
                        )}
                        {isDHLAdmin && (
                          <Button 
                            variant="outline" 
                            onClick={() => { navigate('/dhl-admin'); setIsOpen(false); }}
                            className="border-yellow-200 hover:bg-yellow-50"
                          >
                            <Truck className="mr-2 h-4 w-4 text-yellow-600" />
                            DHL Admin
                          </Button>
                        )}
                        
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
