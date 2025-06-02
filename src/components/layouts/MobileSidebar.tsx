
import React from 'react';
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
  Shield,
  Scale,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileSidebarProps {
  closeSidebar?: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ closeSidebar }) => {
  const location = useLocation();
  const { user, isPremium, isAdmin, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    if (closeSidebar) closeSidebar();
  };

  const handleLinkClick = () => {
    if (closeSidebar) closeSidebar();
  };

  const navigationItems = [
    { label: 'Domů', href: '/', icon: Home, isPublic: true },
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true },
    { label: 'Slovní zásoba', href: '/vocabulary', icon: GraduationCap, isPublic: true },
    { label: 'Překladač', href: '/translator', icon: Globe, isPublic: true },
    { label: 'Kalkulačky', href: '/calculator', icon: Calculator, isPublic: true },
    { label: 'Daňový poradce', href: '/tax-advisor', icon: FileText, isPremium: true },
    { label: 'Směny', href: '/shifts', icon: Calendar, isPremium: true },
    { label: 'Vozidlo', href: '/vehicle', icon: Car, isPremium: true },
    { label: 'Plánování cest', href: '/travel', icon: Map, isPremium: true },
    { label: 'Zákony', href: '/laws', icon: Scale, isPublic: true },
    { label: 'Nastavení', href: '/settings', icon: Settings, requiresAuth: true }
  ];

  const supportItems = [
    { label: 'Premium', href: '/premium', icon: Crown },
    { label: 'Ceník', href: '/pricing', icon: CreditCard },
    { label: 'Kontakt', href: '/contact', icon: Contact },
    { label: 'FAQ', href: '/faq', icon: HelpCircle }
  ];

  // Filter items based on user status
  const getVisibleItems = (items: typeof navigationItems) => {
    return items.filter(item => {
      // Show public items always
      if (item.isPublic) return true;
      
      // Show auth required items only if user is logged in
      if (item.requiresAuth && !user) return false;
      
      // Show premium items if user has premium or is admin, or if it's public
      if (item.isPremium) {
        return isPremium || isAdmin;
      }
      
      return true;
    });
  };

  const visibleNavItems = getVisibleItems(navigationItems);
  const visibleSupportItems = getVisibleItems(supportItems);

  return (
    <div className="flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">PendlerApp</h2>
      </div>

      {/* User section */}
      {user ? (
        <div className="mb-6 p-4 bg-muted rounded-lg">
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
          <div className="flex gap-2 flex-wrap">
            {isPremium && <Badge className="bg-amber-500 text-xs">Premium</Badge>}
            {isAdmin && <Badge className="bg-red-500 text-xs">Admin</Badge>}
          </div>
        </div>
      ) : (
        <div className="mb-6 space-y-2">
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
      )}

      {/* Main navigation - 2 column grid */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Hlavní funkce</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            const needsPremium = item.isPremium && !isPremium && !isAdmin;
            
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "h-20 flex flex-col gap-1 text-xs p-2 relative",
                  isActive && "bg-primary/10 border-primary/20"
                )}
                onClick={handleLinkClick}
              >
                <Link to={item.href}>
                  <Icon className="h-5 w-5" />
                  <span className="text-center leading-tight text-xs font-medium">
                    {item.label}
                  </span>
                  {needsPremium && (
                    <Lock className="h-3 w-3 text-muted-foreground absolute top-1 right-1" />
                  )}
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Support items - 2 column grid */}
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Podpora</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {visibleSupportItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "h-16 flex flex-col gap-1 text-xs p-2",
                  isActive && "bg-primary/10 border-primary/20"
                )}
                onClick={handleLinkClick}
              >
                <Link to={item.href}>
                  <Icon className="h-4 w-4" />
                  <span className="text-center leading-tight text-xs font-medium">
                    {item.label}
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Admin section - only for admin users */}
        {user && isAdmin && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Administrace</h3>
            <Button
              asChild
              variant={location.pathname === '/admin' ? "secondary" : "ghost"}
              className={cn(
                "w-full h-16 flex flex-col gap-1 text-xs p-2",
                location.pathname === '/admin' && "bg-primary/10 border-primary/20"
              )}
              onClick={handleLinkClick}
            >
              <Link to="/admin">
                <Shield className="h-5 w-5" />
                <span className="text-center leading-tight text-xs font-medium">
                  Administrace
                </span>
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Logout button */}
      {user && (
        <div className="mt-4 pt-4 border-t border-border">
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

export default MobileSidebar;
