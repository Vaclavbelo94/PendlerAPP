
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import MobileSidebar from './MobileSidebar';

interface SidebarProps {
  closeSidebar?: () => void;
  isLandscapeSheet?: boolean;
}

const Sidebar = ({ closeSidebar, isLandscapeSheet = false }: SidebarProps) => {
  const location = useLocation();
  const { user, isPremium, isAdmin, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed (icon-only)

  console.log('Sidebar Debug - User:', user?.email);
  console.log('Sidebar Debug - isPremium:', isPremium);
  console.log('Sidebar Debug - isAdmin:', isAdmin);

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

  // Use mobile sidebar for landscape sheet
  if (isLandscapeSheet) {
    return <MobileSidebar closeSidebar={closeSidebar} />;
  }

  const SidebarButton = ({ item, onClick }: { 
    item: { label: string; href: string; icon: any; isPublic?: boolean; requiresAuth?: boolean; isPremium?: boolean }; 
    onClick: () => void;
  }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;
    const needsPremium = item.isPremium && !isPremium && !isAdmin;
    const showItem = item.isPublic || (item.requiresAuth && user) || (item.isPremium && (isPremium || isAdmin));
    
    if (!showItem) return null;
    
    const button = (
      <Button
        asChild
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full relative transition-all duration-200",
          isCollapsed ? "justify-center p-2 h-12 w-12" : "justify-start h-10",
          isActive && "bg-primary/10 text-primary border-l-2 border-primary"
        )}
        onClick={onClick}
      >
        <Link to={item.href}>
          <Icon className={cn(
            "h-5 w-5 transition-all duration-200", 
            !isCollapsed && "mr-3",
            isActive && "text-primary"
          )} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {needsPremium && (
                <Lock className="h-3 w-3 text-muted-foreground ml-2" />
              )}
            </>
          )}
          {isCollapsed && needsPremium && (
            <Lock className="h-2 w-2 text-muted-foreground absolute top-1 right-1" />
          )}
        </Link>
      </Button>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            <p>{item.label}</p>
            {needsPremium && <p className="text-xs text-muted-foreground">Vyžaduje Premium</p>}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border transition-all duration-300 relative",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header with collapse toggle */}
      <div className={cn(
        "flex items-center border-b border-border transition-all duration-300",
        isCollapsed ? "justify-center p-2 h-16" : "justify-between p-4 h-16"
      )}>
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">PendlerApp</h2>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">PA</span>
          </div>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isCollapsed ? 'Rozbalit sidebar' : 'Sbalit sidebar'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* User section */}
      {user ? (
        <div className={cn(
          "border-b border-border transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          <div className={cn(
            "flex items-center gap-3 mb-3",
            isCollapsed && "justify-center"
          )}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 cursor-pointer">
                  <User className="h-5 w-5" />
                </div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p className="font-medium">{user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </TooltipContent>
              )}
            </Tooltip>
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
        <div className={cn(
          "border-b border-border transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          {isCollapsed ? (
            <div className="flex flex-col gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline" size="sm" className="w-full p-2 h-10" onClick={handleLinkClick}>
                    <Link to="/login">
                      <LogIn className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Přihlásit se</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild size="sm" className="w-full p-2 h-10" onClick={handleLinkClick}>
                    <Link to="/register">
                      <UserPlus className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Registrovat se</p>
                </TooltipContent>
              </Tooltip>
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
        <div className={cn("transition-all duration-300", isCollapsed ? "p-2" : "p-4")}>
          {!isCollapsed && (
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Hlavní funkce</h3>
          )}
          <nav className={cn("space-y-1", isCollapsed && "space-y-2")}>
            {navigationItems.map((item) => (
              <SidebarButton key={item.href} item={item} onClick={handleLinkClick} />
            ))}
          </nav>
        </div>

        <div className={cn(
          "border-t border-border transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          {!isCollapsed && (
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Podpora</h3>
          )}
          <nav className={cn("space-y-1", isCollapsed && "space-y-2")}>
            {supportItems.map((item) => (
              <SidebarButton key={item.href} item={item} onClick={handleLinkClick} />
            ))}
          </nav>
        </div>

        {/* Admin section - only for admin users */}
        {user && isAdmin && (
          <div className={cn(
            "border-t border-border transition-all duration-300",
            isCollapsed ? "p-2" : "p-4"
          )}>
            {!isCollapsed && (
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Administrace</h3>
            )}
            <SidebarButton 
              item={{ label: 'Administrace', href: '/admin', icon: Shield }}
              onClick={handleLinkClick}
            />
          </div>
        )}
      </div>

      {/* Logout button */}
      {user && (
        <div className={cn(
          "border-t border-border transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full p-2 h-10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Odhlásit se</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Odhlásit se
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
