
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  User, 
  Car, 
  Languages, 
  Calendar, 
  Settings, 
  Crown, 
  Shield,
  Map,
  Scale,
  FileText,
  BarChart3,
  Contact,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface ModernSidebarProps {
  closeSidebar?: () => void;
}

interface NavItem {
  path: string;
  title: string;
  icon: React.ComponentType<any>;
  badge?: number;
  adminOnly?: boolean;
  premium?: boolean;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({ closeSidebar }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, isPremium, isAdmin } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      path: '/dashboard',
      title: t('dashboard') || 'Dashboard',
      icon: BarChart3
    },
    {
      path: '/shifts',
      title: t('shifts') || 'Směny',
      icon: Calendar
    },
    {
      path: '/translator',
      title: t('translator') || 'Překladač',
      icon: Languages
    },
    {
      path: '/vehicle',
      title: t('vehicle') || 'Vozidlo',
      icon: Car
    },
    {
      path: '/tax-advisor',
      title: t('taxAdvisor') || 'Daňový poradce',
      icon: FileText
    },
    {
      path: '/travel',
      title: t('travel') || 'Cestování',
      icon: Map
    },
    {
      path: '/laws',
      title: t('laws') || 'Zákony',
      icon: Scale
    },
    {
      path: '/premium',
      title: t('premium') || 'Premium',
      icon: Crown,
      premium: true
    },
    {
      path: '/settings',
      title: t('settings') || 'Nastavení',
      icon: Settings
    },
    {
      path: '/profile',
      title: t('profile') || 'Profil',
      icon: User
    },
    {
      path: '/contact',
      title: t('contact') || 'Kontakt',
      icon: Contact
    },
    {
      path: '/faq',
      title: t('faq') || 'FAQ',
      icon: HelpCircle
    }
  ];

  // Add admin item if user is admin
  if (isAdmin) {
    navItems.push({
      path: '/admin',
      title: t('admin') || 'Administrace',
      icon: Shield,
      adminOnly: true
    });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "h-full bg-gradient-to-b from-card to-card/80 border-r border-border/50 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link to="/" className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    PendlerApp
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {user?.email?.split('@')[0] || t('user')}
                  </p>
                </div>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative",
                    active 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "hover:bg-accent hover:text-accent-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    active && "text-primary",
                    item.premium && "text-amber-500",
                    item.adminOnly && "text-red-500"
                  )} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 font-medium">
                        {item.title}
                      </span>
                      
                      {item.premium && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                          PRO
                        </Badge>
                      )}
                      
                      {item.adminOnly && (
                        <Badge variant="destructive" className="text-xs">
                          Admin
                        </Badge>
                      )}
                      
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border/50">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-2">
                {isPremium ? (
                  <div className="flex items-center justify-center gap-1 text-amber-600">
                    <Crown className="h-3 w-3" />
                    <span>Premium aktivní</span>
                  </div>
                ) : (
                  <Link to="/premium" className="text-primary hover:underline">
                    Upgradovat na Premium
                  </Link>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                © 2024 PendlerApp
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
