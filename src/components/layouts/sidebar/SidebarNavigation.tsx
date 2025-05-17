
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  Calculator,
  Calendar,
  GraduationCap,
  Home,
  Languages,
  CarTaxiFront,
  LucideIcon,
  Pencil,
  Scale,
  User,
  Gavel,
  Map,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
  premium?: boolean;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

interface SidebarNavigationProps {
  closeSidebar: () => void;
}

const SidebarNavigation = ({ closeSidebar }: SidebarNavigationProps) => {
  const location = useLocation();
  const { isAdmin, isPremium } = useAuth();

  const mainNavItems: NavigationItem[] = [
    {
      name: "Domů",
      path: "/",
      icon: Home
    },
    {
      name: "Výuka jazyka",
      path: "/language",
      icon: GraduationCap
    }
  ];

  const toolsNavItems: NavigationItem[] = [
    {
      name: "Překladač",
      path: "/translator",
      icon: Languages
    },
    {
      name: "Kalkulačka",
      path: "/calculator",
      icon: Calculator
    },
    {
      name: "Směny",
      path: "/shifts",
      icon: Calendar
    },
    {
      name: "Doprava",
      path: "/vehicle",
      icon: CarTaxiFront
    },
    {
      name: "Plánování cest",
      path: "/travel-planning",
      icon: Map,
      premium: true
    },
    {
      name: "Daňový poradce",
      path: "/tax-advisor",
      icon: FileText,
      premium: true
    }
  ];

  const infoNavItems: NavigationItem[] = [
    {
      name: "Zákony",
      path: "/laws",
      icon: Scale
    },
    {
      name: "Právní asistent",
      path: "/legal-assistant",
      icon: Gavel,
      premium: true
    },
    {
      name: "O nás",
      path: "/about",
      icon: Pencil
    }
  ];

  const accountNavItems: NavigationItem[] = [
    {
      name: "Profil",
      path: "/profile",
      icon: User
    }
  ];

  // Pokud je uživatel admin, přidáme do navigace admin sekci
  if (isAdmin) {
    accountNavItems.push({
      name: "Admin",
      path: "/admin",
      icon: BookOpen
    });
  }

  // Všechny skupiny navigace
  const navigationGroups: NavigationGroup[] = [
    {
      title: "Hlavní",
      items: mainNavItems
    },
    {
      title: "Nástroje",
      items: toolsNavItems
    },
    {
      title: "Informace",
      items: infoNavItems
    },
    {
      title: "Účet",
      items: accountNavItems
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="space-y-6">
      {navigationGroups.map((group, index) => (
        <div key={group.title} className="space-y-2">
          <div className="pl-4">
            <h3 className="text-xs font-medium text-sidebar-foreground/60">{group.title}</h3>
          </div>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isPremiumItem = item.premium && !isPremium;
              
              return (
                <Link
                  key={item.name}
                  to={!isPremiumItem ? item.path : "/premium"}
                  onClick={closeSidebar}
                  className="block"
                >
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start",
                      isActive(item.path) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
                      "hover:bg-sidebar-hover hover:text-sidebar-hover-foreground"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                    {isPremiumItem && (
                      <span className="ml-auto inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        Premium
                      </span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
          {index < navigationGroups.length - 1 && <Separator className="bg-sidebar-border mt-2" />}
        </div>
      ))}
    </nav>
  );
};

export default SidebarNavigation;
