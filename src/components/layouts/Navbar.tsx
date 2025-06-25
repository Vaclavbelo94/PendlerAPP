
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  Crown,
  Truck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { canAccessDHLFeatures, isDHLAdmin } from '@/utils/dhlAuthUtils';

const Navbar = () => {
  const { user, isAdmin, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // DHL authentication checks with debug logging
  const isDHLUser = canAccessDHLFeatures(user);
  const isDHLAdminUser = isDHLAdmin(user);

  useEffect(() => {
    console.log('Navbar DHL checks:', {
      user: user?.email,
      isDHLUser,
      isDHLAdminUser,
      isAdmin,
      isPremium
    });
  }, [user, isDHLUser, isDHLAdminUser, isAdmin, isPremium]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/login');
      toast.success('Úspěšně jste se odhlásili');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Chyba při odhlašování');
    }
  };

  const NavLinks = () => (
    <>
      {/* Regular navigation links */}
      <Link to="/dashboard">
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Dashboard
        </Button>
      </Link>
      <Link to="/shifts">
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Směny
        </Button>
      </Link>
      <Link to="/translator">
        <Button variant="ghost" className="text-foreground hover:text-primary">
          Překladač
        </Button>
      </Link>

      {/* DHL Links - only show for DHL users */}
      {isDHLUser && (
        <>
          <Link to="/dhl-dashboard">
            <Button variant="ghost" className="text-yellow-600 hover:text-yellow-700 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              DHL Dashboard
            </Button>
          </Link>
          {isDHLAdminUser && (
            <Link to="/dhl-admin">
              <Button variant="ghost" className="text-yellow-600 hover:text-yellow-700 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                DHL Admin
              </Button>
            </Link>
          )}
        </>
      )}
    </>
  );

  const UserDropdownContent = () => (
    <>
      <DropdownMenuItem asChild>
        <Link to="/profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profil
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Nastavení
        </Link>
      </DropdownMenuItem>
      
      {/* DHL Dashboard for DHL users */}
      {isDHLUser && (
        <DropdownMenuItem asChild>
          <Link to="/dhl-dashboard" className="flex items-center gap-2 text-yellow-600">
            <Truck className="h-4 w-4" />
            DHL Dashboard
          </Link>
        </DropdownMenuItem>
      )}
      
      {/* DHL Admin for DHL admins only */}
      {isDHLAdminUser && (
        <DropdownMenuItem asChild>
          <Link to="/dhl-admin" className="flex items-center gap-2 text-yellow-600">
            <Truck className="h-4 w-4" />
            DHL Admin
          </Link>
        </DropdownMenuItem>
      )}
      
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
        <LogOut className="h-4 w-4 mr-2" />
        Odhlásit se
      </DropdownMenuItem>
    </>
  );

  const MobileMenuContent = () => (
    <div className="flex flex-col space-y-4 p-4">
      <Link to="/dashboard" onClick={() => setIsOpen(false)}>
        <Button variant="ghost" className="w-full justify-start">
          Dashboard
        </Button>
      </Link>
      <Link to="/shifts" onClick={() => setIsOpen(false)}>
        <Button variant="ghost" className="w-full justify-start">
          Směny
        </Button>
      </Link>
      <Link to="/translator" onClick={() => setIsOpen(false)}>
        <Button variant="ghost" className="w-full justify-start">
          Překladač
        </Button>
      </Link>
      
      {/* DHL Section for mobile */}
      {isDHLUser && (
        <>
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2 px-2">
              <Truck className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">DHL</span>
            </div>
            <Link to="/dhl-dashboard" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-yellow-600 hover:text-yellow-700">
                <Truck className="h-4 w-4 mr-2" />
                DHL Dashboard
              </Button>
            </Link>
            {isDHLAdminUser && (
              <Link to="/dhl-admin" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-yellow-600 hover:text-yellow-700">
                  <Truck className="h-4 w-4 mr-2" />
                  DHL Admin
                </Button>
              </Link>
            )}
          </div>
        </>
      )}

      <div className="border-t pt-4">
        <Link to="/profile" onClick={() => setIsOpen(false)}>
          <Button variant="ghost" className="w-full justify-start">
            <User className="h-4 w-4 mr-2" />
            Profil
          </Button>
        </Link>
        <Link to="/settings" onClick={() => setIsOpen(false)}>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Nastavení
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600" 
          onClick={() => {
            setIsOpen(false);
            handleSignOut();
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Odhlásit se
        </Button>
      </div>
    </div>
  );

  if (!user) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="font-bold">
            PendlerApp
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Přihlásit se</Button>
            </Link>
            <Link to="/register">
              <Button>Registrovat se</Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-bold">
          PendlerApp
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {/* Status badges */}
          <div className="hidden sm:flex items-center gap-2">
            {isPremium && (
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            {isDHLUser && (
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-red-500 text-white">
                <Truck className="h-3 w-3 mr-1" />
                DHL
              </Badge>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <MobileMenuContent />
            </SheetContent>
          </Sheet>

          {/* Desktop User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden md:flex">
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <UserDropdownContent />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
