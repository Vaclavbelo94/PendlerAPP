import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  BarChart3,
  GraduationCap,
  Calendar,
  Calculator,
  Car,
  FileText,
  Globe,
  Map,
  Settings,
  Crown,
  CreditCard,
  Contact,
  HelpCircle,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Shield
} from 'lucide-react';

const MobileNavigation = ({ onClose }: { onClose: () => void }) => {
  const location = useLocation();
  const { user, isPremium, isAdmin, signOut } = useAuth();

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const navigationItems = [
    { label: 'Domů', href: '/', icon: Home },
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3, authRequired: true },
    { label: 'Lekce němčiny', href: '/vocabulary', icon: GraduationCap },
    { label: 'Směny', href: '/shifts', icon: Calendar, authRequired: true },
    { label: 'Kalkulačka', href: '/calculator', icon: Calculator },
    { label: 'Vozidlo', href: '/vehicle', icon: Car, authRequired: true },
    { label: 'Daňový poradce', href: '/tax-advisor', icon: FileText },
    { label: 'Překladač', href: '/translator', icon: Globe },
    { label: 'Plánování cest', href: '/travel', icon: Map },
    { label: 'Nastavení', href: '/settings', icon: Settings, authRequired: true }
  ];

  const supportItems = [
    { label: 'Premium', href: '/premium', icon: Crown },
    { label: 'Ceník', href: '/pricing', icon: CreditCard },
    { label: 'Kontakt', href: '/contact', icon: Contact },
    { label: 'FAQ', href: '/faq', icon: HelpCircle }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* User section */}
      {user ? (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isPremium && <Badge className="bg-amber-500 text-xs">Premium</Badge>}
            {isAdmin && <Badge className="bg-red-500 text-xs">Admin</Badge>}
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-border">
          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start" onClick={handleLinkClick}>
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Přihlásit se
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" onClick={handleLinkClick}>
              <Link to="/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Registrovat se
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Hlavní funkce</h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              if (item.authRequired && !user) return null;
              
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={handleLinkClick}
                >
                  <Link to={item.href}>
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Podpora</h3>
          <nav className="space-y-1">
            {supportItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={handleLinkClick}
                >
                  <Link to={item.href}>
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Admin section */}
        {user && isAdmin && (
          <div className="p-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Administrace</h3>
            <Button
              asChild
              variant={location.pathname === '/admin' ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={handleLinkClick}
            >
              <Link to="/admin">
                <Shield className="h-4 w-4 mr-3" />
                Admin panel
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Logout button */}
      {user && (
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Odhlásit se
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;
