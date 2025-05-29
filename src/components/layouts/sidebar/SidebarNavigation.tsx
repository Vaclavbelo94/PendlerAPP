import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Calculator, 
  DollarSign, 
  Car, 
  CalendarDays, 
  GraduationCap, 
  Scale, 
  Settings, 
  MapPin,
  Languages,
  Shield
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarNavigationProps {
  closeSidebar: () => void;
  isHorizontal?: boolean;
}

const SidebarNavigation = ({ closeSidebar, isHorizontal = false }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const navigationItems = [
    { name: "Domů", path: "/", icon: Home, category: "main" },
    ...(user ? [{ name: "Dashboard", path: "/dashboard", icon: Home, category: "main" }] : []),
    { name: "Kalkulačka", path: "/calculator", icon: Calculator, category: "tools" },
    { name: "Daňový poradce", path: "/tax-advisor", icon: DollarSign, category: "tools" },
    { name: "Vozidlo", path: "/vehicle", icon: Car, category: "tools" },
    ...(user ? [{ name: "Směny", path: "/shifts", icon: CalendarDays, category: "work" }] : []),
    { name: "Lekce němčiny", path: "/vocabulary", icon: GraduationCap, category: "learning" },
    { name: "Překladač", path: "/translator", icon: Languages, category: "learning" },
    { name: "Zákony", path: "/laws", icon: Scale, category: "legal" },
    { name: "Cesty", path: "/travel", icon: MapPin, category: "planning" },
    { name: "Nastavení", path: "/settings", icon: Settings, category: "system" },
    ...(isAdmin ? [{ name: "Administrace", path: "/admin", icon: Shield, category: "admin" }] : []),
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "main": return "from-blue-500/20 to-blue-600/20 border-blue-500/30";
      case "tools": return "from-green-500/20 to-green-600/20 border-green-500/30";
      case "work": return "from-purple-500/20 to-purple-600/20 border-purple-500/30";
      case "learning": return "from-amber-500/20 to-amber-600/20 border-amber-500/30";
      case "legal": return "from-red-500/20 to-red-600/20 border-red-500/30";
      case "planning": return "from-indigo-500/20 to-indigo-600/20 border-indigo-500/30";
      case "system": return "from-gray-500/20 to-gray-600/20 border-gray-500/30";
      case "admin": return "from-orange-500/20 to-orange-600/20 border-orange-500/30";
      default: return "from-sidebar-accent/20 to-sidebar-accent/30 border-sidebar-border/30";
    }
  };

  // Horizontální layout pro landscape sheet
  if (isHorizontal) {
    return (
      <div className="grid grid-cols-3 gap-1 max-h-[200px] overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const categoryColors = getCategoryColor(item.category);
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center h-16 text-[10px] leading-tight p-1 relative group transition-all duration-300 ${
                active 
                  ? `bg-gradient-to-br ${categoryColors} text-sidebar-accent-foreground shadow-lg scale-105` 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/30 hover:scale-105"
              }`}
            >
              <Icon className={`h-4 w-4 mb-1 flex-shrink-0 transition-all duration-300 ${
                active ? "animate-pulse" : "group-hover:rotate-6"
              }`} />
              <span className="text-center break-words max-w-full leading-3 font-medium">{item.name}</span>
              {active && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-md pointer-events-none" />
              )}
            </Button>
          );
        })}
      </div>
    );
  }

  // Původní vertikální layout s vylepšeným stylingem
  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        const categoryColors = getCategoryColor(item.category);
        
        return (
          <Button
            key={item.path}
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation(item.path)}
            className={`w-full justify-start relative group transition-all duration-300 ${
              active 
                ? `bg-gradient-to-r ${categoryColors} text-sidebar-accent-foreground shadow-lg scale-[1.02] font-medium` 
                : "text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/30 hover:to-sidebar-accent/20 hover:scale-[1.01]"
            }`}
          >
            <Icon className={`h-4 w-4 mr-3 transition-all duration-300 ${
              active ? "animate-pulse" : "group-hover:rotate-6 group-hover:scale-110"
            }`} />
            <span className="font-medium">{item.name}</span>
            {active && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-md pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
              </>
            )}
          </Button>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
