
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Calculator, 
  DollarSign, 
  Car, 
  CalendarDays, 
  BookOpen, 
  Scale, 
  Settings, 
  MapPin,
  Languages
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarNavigationProps {
  closeSidebar: () => void;
  isHorizontal?: boolean;
}

const SidebarNavigation = ({ closeSidebar, isHorizontal = false }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    { name: "Domů", path: "/", icon: Home },
    ...(user ? [{ name: "Dashboard", path: "/dashboard", icon: Home }] : []),
    { name: "Kalkulačka", path: "/calculator", icon: Calculator },
    { name: "Daňový poradce", path: "/tax-advisor", icon: DollarSign },
    { name: "Vozidlo", path: "/vehicle", icon: Car },
    ...(user ? [{ name: "Směny", path: "/shifts", icon: CalendarDays }] : []),
    { name: "Slovíčka", path: "/vocabulary", icon: BookOpen },
    { name: "Překladač", path: "/translator", icon: Languages },
    { name: "Zákony", path: "/laws", icon: Scale },
    { name: "Cesty", path: "/travel-planning", icon: MapPin },
    { name: "Nastavení", path: "/settings", icon: Settings },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Horizontální layout pro landscape sheet
  if (isHorizontal) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={`justify-start h-8 text-xs ${
                isActive(item.path) 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Button>
          );
        })}
      </div>
    );
  }

  // Původní vertikální layout
  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "secondary" : "ghost"}
            size="sm"
            onClick={() => handleNavigation(item.path)}
            className={`w-full justify-start ${
              isActive(item.path) 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon className="h-4 w-4 mr-3" />
            {item.name}
          </Button>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
