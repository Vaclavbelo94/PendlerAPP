
import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Home,
  Languages,
  Car,
  Calendar,
  Calculator,
  Scale,
  Plane,
  Building2,
  BarChart3,
  FileText,
} from "lucide-react";
import { PremiumBadge } from "@/components/premium/PremiumBadge";
import { useUnifiedPremiumStatus } from "@/hooks/useUnifiedPremiumStatus";

interface SidebarNavigationProps {
  closeSidebar: () => void;
}

const SidebarNavigation = ({ closeSidebar }: SidebarNavigationProps) => {
  const location = useLocation();
  const { user, isPremium } = useAuth();
  const { canAccess: canAccessLaws } = useUnifiedPremiumStatus('laws-detail');
  const { canAccess: canAccessLegal } = useUnifiedPremiumStatus('legal-assistant');
  const { canAccess: canAccessDashboard } = useUnifiedPremiumStatus('personal-dashboard');
  const { canAccess: canAccessTaxAdvisor } = useUnifiedPremiumStatus('tax-advisor');
  const { canAccess: canAccessVehicle } = useUnifiedPremiumStatus('vehicle-management');
  const { canAccess: canAccessShifts } = useUnifiedPremiumStatus('shifts-planning');
  const { canAccess: canAccessCalculator } = useUnifiedPremiumStatus('calculators');
  const { canAccess: canAccessTranslator } = useUnifiedPremiumStatus('translator');
  const { canAccess: canAccessTravelPlanning } = useUnifiedPremiumStatus('travel-planning');
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Definice navigačních položek - všechny položky jsou prémiové kromě výuky němčiny
  const mainItems = [
    { name: "Domů", path: "/", icon: Home, premium: false },
    { name: "Výuka němčiny", path: "/language", icon: Languages, premium: false },
    { name: "Osobní Dashboard", path: "/dashboard", icon: BarChart3, premium: true },
    { name: "Správa vozidla", path: "/vehicle", icon: Car, premium: true },
    { name: "Plánování směn", path: "/shifts", icon: Calendar, premium: true },
    { name: "Kalkulačky", path: "/calculator", icon: Calculator, premium: true },
    { name: "Daňový poradce", path: "/tax-advisor", icon: FileText, premium: true },
    { name: "Zákony", path: "/laws", icon: Scale, premium: true },
    { name: "Překladač", path: "/translator", icon: Languages, premium: true },
    { name: "Plánování cest", path: "/travel-planning", icon: Plane, premium: true },
  ];
  
  // Prémiové položky
  const premiumItems = [
    { name: "Právní asistent", path: "/legal-assistant", icon: Building2 }
  ];
  
  // Funkce pro vykreslení navigační položky
  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    
    // Kontrola zda je položka prémiová a zda má uživatel přístup
    let showPremiumBadge = false;
    let isDisabled = false;
    
    if (item.premium) {
      if (item.path === "/laws" && !canAccessLaws) {
        isDisabled = true;
        showPremiumBadge = true;
      } else if (item.path === "/dashboard" && !canAccessDashboard) {
        isDisabled = true;
        showPremiumBadge = true;
      } else if (item.path === "/tax-advisor" && !canAccessTaxAdvisor) {
        isDisabled = true;
        showPremiumBadge = true;
      } else if (item.path === "/vehicle" && !canAccessVehicle) {
        isDisabled = true;
        showPremiumBadge = true;
      } else if (item.path === "/shifts" && !canAccessShifts) {
        isDisabled = true;
        showPremiumBadge = true;
      } else if (item.path === "/calculator" && !canAccessCalculator) {
        isDisabled = true;
        showPremiumBadge = true;
      } else if (item.path === "/translator" && !canAccessTranslator) {
        isDisabled = true;
        showPremiumBadge = true;
      } else if (item.path === "/travel-planning" && !canAccessTravelPlanning) {
        isDisabled = true;
        showPremiumBadge = true;
      }
    }
    
    return (
      <Link
        key={item.path}
        to={isDisabled ? "#" : item.path}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-hover transition-colors",
          isActive(item.path) && "bg-sidebar-active text-sidebar-foreground font-medium",
          isDisabled && "opacity-60 pointer-events-none"
        )}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          closeSidebar();
        }}
      >
        <Icon className="h-5 w-5" />
        <span>{item.name}</span>
        {showPremiumBadge && <PremiumBadge variant="compact" />}
      </Link>
    );
  };
  
  return (
    <nav>
      <div className="space-y-1">
        {mainItems.map(renderNavItem)}
      </div>
      
      {(isPremium || canAccessLegal) && (
        <>
          <div className="my-2 px-3 text-xs font-medium text-sidebar-foreground/60">
            Prémiové funkce
          </div>
          <div className="space-y-1">
            {premiumItems.map(renderNavItem)}
          </div>
        </>
      )}
    </nav>
  );
};

export default SidebarNavigation;
