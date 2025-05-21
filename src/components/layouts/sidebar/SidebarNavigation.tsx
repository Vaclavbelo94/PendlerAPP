
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  BookOpenIcon, 
  GlobeIcon, 
  CalculatorIcon, 
  CarIcon,
  CalendarIcon,
  FileTextIcon,
  MapIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  InfoIcon,
  Palette,
  ShieldIcon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarNavigationProps {
  closeSidebar: () => void;
}

const SidebarNavigation = ({ closeSidebar }: SidebarNavigationProps) => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  // Navigační položky
  const navigationItems = [
    { name: "Domů", href: "/", icon: HomeIcon },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
    { name: "Němčina", href: "/language", icon: BookOpenIcon },
    { name: "Překladač", href: "/translator", icon: GlobeIcon },
    { name: "Kalkulačky", href: "/calculator", icon: CalculatorIcon },
    { name: "Vozidlo", href: "/vehicle", icon: CarIcon },
    { name: "Směny", href: "/shifts", icon: CalendarIcon },
    { name: "Doprava", href: "/travel-planning", icon: MapIcon },
    { name: "Daně", href: "/tax-advisor", icon: FileTextIcon },
    { name: "Zákony", href: "/laws", icon: InfoIcon },
    { name: "Design System", href: "/design-system", icon: Palette },
    { name: "FAQ", href: "/faq", icon: HelpCircleIcon }
  ];
  
  // Přidáme admin položku, pokud je uživatel admin
  const adminNavigationItem = { name: "Administrace", href: "/admin", icon: ShieldIcon };
  
  // Funkce pro určení aktivní položky
  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };
  
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-sidebar-foreground/60 pl-4 pb-1">Navigace</p>
      
      {/* Admin položka na začátku navigace, pokud je uživatel admin */}
      {isAdmin && (
        <Link
          to={adminNavigationItem.href}
          onClick={closeSidebar}
          className={cn(
            "flex items-center text-sm px-3 py-2 rounded-md transition-colors",
            isActive(adminNavigationItem.href) 
              ? "bg-primary text-primary-foreground" 
              : "text-sidebar-foreground hover:bg-sidebar-hover"
          )}
        >
          <adminNavigationItem.icon className={cn("h-4 w-4 mr-3", isActive(adminNavigationItem.href) ? "text-primary-foreground" : "text-sidebar-foreground/70")} />
          <span>{adminNavigationItem.name}</span>
        </Link>
      )}
      
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={closeSidebar}
            className={cn(
              "flex items-center text-sm px-3 py-2 rounded-md transition-colors",
              active 
                ? "bg-primary text-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-hover"
            )}
          >
            <Icon className={cn("h-4 w-4 mr-3", active ? "text-primary-foreground" : "text-sidebar-foreground/70")} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarNavigation;
