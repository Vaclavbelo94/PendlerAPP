
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
  Shield,
  Scale,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  closeSidebar?: () => void;
  isLandscapeSheet?: boolean;
}

const Sidebar = ({ closeSidebar, isLandscapeSheet = false }: SidebarProps) => {
  const location = useLocation();
  const { user, isPremium, isAdmin, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    if (closeSidebar) closeSidebar();
  };

  const handleLinkClick = () => {
    if (closeSidebar) closeSidebar();
  };

  const navigationItems = [
    { label: 'Domů', href: '/', icon: Home, isPublic: true },
    { label: 'Dashboard', href: '/dashboard', icon: BarChart3, isPremium: true },
    { label: 'Lekce němčiny', href: '/vocabulary', icon: GraduationCap, isPublic: true },
    { label: 'Směny', href: '/shifts', icon: Calendar, isPremium: true },
    { label: 'Kalkulačka', href: '/calculator', icon: Calculator, isPublic: true },
    { label: 'Vozidlo', href: '/vehicle', icon: Car, isPremium: true },
    { label: 'Daňový poradce', href: '/tax-advisor', icon: FileText, isPremium: true },
    { label: 'Překladač', href: '/translator', icon: Globe, isPublic: true },
    { label: 'Plánování cest', href: '/travel', icon: Map, isPremium: true },
    { label: 'Zákony', href: '/laws', icon: Scale, isPublic: true },
    { label: 'Nastavení', href: '/settings', icon: Settings, isPremium: true }
  ];

  const supportItems = [
    { label: 'Premium', href: '/premium', icon: Crown },
    { label: 'Ceník', href: '/pricing', icon: CreditCard },
    { label: 'Kontakt', href: '/contact', icon: Contact },
    { label: 'FAQ', href: '/faq', icon: HelpCircle }
  ];

  // Use compact layout for landscape sheet
  if (isLandscapeSheet) {
    return (
      <div className="flex flex-col h-full p-4">
        {/* Compact header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Pendler App</h2>
        </div>

        {/* User section */}
        {user ? (
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
                </p>
                <div className="flex gap-1">
                  {isPremium && <Badge className="bg-amber-500 text-xs">Premium</Badge>}
                  {isAdmin && <Badge className="bg-red-500 text-xs">Admin</Badge>}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1" onClick={handleLinkClick}>
                <Link to="/login">
                  <LogIn className="h-3 w-3 mr-1" />
                  Přihlásit
                </Link>
              </Button>
              <Button asChild size="sm" className="flex-1" onClick={handleLinkClick}>
                <Link to="/register">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Registrovat
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Navigation in grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-1 mb-4">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              const needsPremium = item.isPremium && !isPremium && !isAdmin;
              
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="h-16 flex flex-col text-xs p-1"
                  onClick={handleLinkClick}
                >
                  <Link to={item.href}>
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-center leading-tight">{item.label}</span>
                    {needsPremium && (
                      <Lock className="h-2 w-2 text-muted-foreground absolute top-1 right-1" />
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Support items */}
          <div className="grid grid-cols-2 gap-1">
            {supportItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="h-12 flex flex-col text-xs"
                  onClick={handleLinkClick}
                >
                  <Link to={item.href}>
                    <Icon className="h-3 w-3 mb-1" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        {user && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-3 w-3 mr-2" />
              Odhlásit se
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">Pendler App</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User section */}
      {user ? (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex gap-2">
              {isPremium && <Badge className="bg-amber-500 text-xs">Premium</Badge>}
              {isAdmin && <Badge className="bg-red-500 text-xs">Admin</Badge>}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 border-b border-border">
          {isCollapsed ? (
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="w-full p-2" onClick={handleLinkClick}>
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="sm" className="w-full p-2" onClick={handleLinkClick}>
                <Link to="/register">
                  <UserPlus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {!isCollapsed && (
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Hlavní funkce</h3>
          )}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              const needsPremium = item.isPremium && !isPremium && !isAdmin;
              
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full",
                    isCollapsed ? "justify-center p-2" : "justify-start"
                  )}
                  title={isCollapsed ? item.label : undefined}
                  onClick={handleLinkClick}
                >
                  <Link to={item.href}>
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {needsPremium && (
                          <Lock className="h-3 w-3 text-muted-foreground ml-2" />
                        )}
                      </>
                    )}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          {!isCollapsed && (
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Podpora</h3>
          )}
          <nav className="space-y-1">
            {supportItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full",
                    isCollapsed ? "justify-center p-2" : "justify-start"
                  )}
                  title={isCollapsed ? item.label : undefined}
                  onClick={handleLinkClick}
                >
                  <Link to={item.href}>
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                    {!isCollapsed && item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Admin section */}
        {user && isAdmin && (
          <div className="p-4 border-t border-border">
            {!isCollapsed && (
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Administrace</h3>
            )}
            <Button
              asChild
              variant={location.pathname === '/admin' ? "secondary" : "ghost"}
              className={cn(
                "w-full",
                isCollapsed ? "justify-center p-2" : "justify-start"
              )}
              title={isCollapsed ? "Admin panel" : undefined}
              onClick={handleLinkClick}
            >
              <Link to="/admin">
                <Shield className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && "Admin panel"}
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
            className={cn(
              "w-full",
              isCollapsed ? "justify-center p-2" : "justify-start"
            )}
            onClick={handleLogout}
            title={isCollapsed ? "Odhlásit se" : undefined}
          >
            <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && "Odhlásit se"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
