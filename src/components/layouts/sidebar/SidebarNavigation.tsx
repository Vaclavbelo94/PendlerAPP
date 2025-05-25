
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home,
  Calculator,
  Car,
  Calendar,
  BookOpen,
  Languages,
  FileText,
  MapPin,
  Crown,
  Settings,
  Users,
  Shield
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface SidebarNavigationProps {
  closeSidebar: () => void;
}

const SidebarNavigation = ({ closeSidebar }: SidebarNavigationProps) => {
  const location = useLocation();
  const { user, isPremium, isAdmin } = useAuth();

  const mainItems = [
    {
      name: "Domů",
      href: user ? "/dashboard" : "/",
      icon: Home,
      requiresAuth: false
    },
    {
      name: "Kalkulačky",
      href: "/calculator",
      icon: Calculator,
      requiresAuth: true,
      isPremium: true
    },
    {
      name: "Daňový poradce",
      href: "/tax-advisor",
      icon: FileText,
      requiresAuth: true,
      isPremium: true
    },
    {
      name: "Správa vozidel",
      href: "/vehicle",
      icon: Car,
      requiresAuth: true
    },
    {
      name: "Správa směn",
      href: "/shifts",
      icon: Calendar,
      requiresAuth: true
    },
    {
      name: "Výuka němčiny",
      href: "/vocabulary",
      icon: BookOpen,
      requiresAuth: true,
      isPremium: true
    },
    {
      name: "Překladač",
      href: "/translator",
      icon: Languages,
      requiresAuth: true,
      isPremium: true
    },
    {
      name: "Právní informace",
      href: "/laws",
      icon: Shield,
      requiresAuth: false
    },
    {
      name: "Plánování cest",
      href: "/travel-planning",
      icon: MapPin,
      requiresAuth: true,
      isPremium: true
    }
  ];

  const bottomItems = [
    {
      name: "Premium",
      href: "/premium",
      icon: Crown,
      requiresAuth: false,
      className: "text-amber-600 dark:text-amber-400"
    },
    {
      name: "Nastavení",
      href: "/settings",
      icon: Settings,
      requiresAuth: true
    }
  ];

  // Add admin items if user is admin
  if (isAdmin) {
    bottomItems.unshift({
      name: "Admin Panel",
      href: "/admin-panel",
      icon: Users,
      requiresAuth: true,
      className: "text-red-600 dark:text-red-400"
    });
  }

  const isActive = (href: string) => {
    if (href === "/" && location.pathname !== "/") return false;
    if (href === "/dashboard" && location.pathname === "/") return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const shouldShowItem = (item: any) => {
    if (item.requiresAuth && !user) return false;
    return true;
  };

  return (
    <div className="space-y-1">
      <div className="space-y-1">
        <p className="text-xs font-medium text-sidebar-foreground/60 pl-4 pb-1">
          Hlavní navigace
        </p>
        {mainItems.filter(shouldShowItem).map((item) => (
          <Button
            key={item.name}
            variant={isActive(item.href) ? "secondary" : "ghost"}
            className={`w-full justify-start h-10 px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
              isActive(item.href) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
            } ${item.className || ''}`}
            asChild
            onClick={closeSidebar}
          >
            <Link to={item.href} className="flex items-center gap-3">
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.name}</span>
              {item.isPremium && !isPremium && (
                <Badge className="bg-amber-500 text-white text-xs px-1 py-0 h-4">
                  Pro
                </Badge>
              )}
            </Link>
          </Button>
        ))}
      </div>
      
      <div className="pt-4 space-y-1">
        <p className="text-xs font-medium text-sidebar-foreground/60 pl-4 pb-1">
          Účet
        </p>
        {bottomItems.filter(shouldShowItem).map((item) => (
          <Button
            key={item.name}
            variant={isActive(item.href) ? "secondary" : "ghost"}
            className={`w-full justify-start h-10 px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
              isActive(item.href) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
            } ${item.className || ''}`}
            asChild
            onClick={closeSidebar}
          >
            <Link to={item.href} className="flex items-center gap-3">
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.name}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SidebarNavigation;
