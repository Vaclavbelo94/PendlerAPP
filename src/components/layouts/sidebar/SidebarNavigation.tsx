
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
  ShieldIcon,
  MapPinned
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarNavigationProps {
  closeSidebar: () => void;
}

const SidebarNavigation = ({ closeSidebar }: SidebarNavigationProps) => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  console.log("SidebarNavigation - isAdmin status:", isAdmin);
  
  // Hlavní navigační sekce
  const mainNavigation = [
    { name: "Domů", href: "/", icon: HomeIcon, description: "Úvodní stránka aplikace" },
    { name: "Můj Dashboard", href: "/dashboard", icon: LayoutDashboardIcon, description: "Přehled vašeho pokroku a aktivit" },
  ];

  // Pracovní sekce
  const workSections = [
    { name: "Moje směny", href: "/shifts", icon: CalendarIcon, description: "Plánování a evidence pracovních směn" },
    { name: "Moje vozidlo", href: "/vehicle", icon: CarIcon, description: "Správa vozidla a nákladů na dopravu" },
    { name: "Kalkulačky", href: "/calculator", icon: CalculatorIcon, description: "Daňové a finanční kalkulačky" },
    { name: "Daňové poradenství", href: "/tax-advisor", icon: FileTextIcon, description: "Pomoc s daňovými povinnostmi" },
    { name: "Doprava", href: "/travel-planning", icon: MapIcon, description: "Plánování cest a optimalizace tras" },
  ];

  // Osobní rozvoj a vzdělávání
  const personalSections = [
    { name: "Výuka jazyka", href: "/language", icon: BookOpenIcon, description: "Učení němčiny a slovní zásoba" },
    { name: "Překladač", href: "/translator", icon: GlobeIcon, description: "Překlad textů a frází" },
  ];

  // Ostatní nástroje
  const toolsSections = [
    { name: "Mapa pendlerů", href: "/commuting-map", icon: MapPinned, description: "Komunita pendlerů ve vašem okolí" },
    { name: "Právní informace", href: "/laws", icon: InfoIcon, description: "Zákony a předpisy pro pendlery" },
    { name: "Nápověda", href: "/faq", icon: HelpCircleIcon, description: "Často kladené otázky a pomoc" },
    { name: "Design System", href: "/design-system", icon: Palette, description: "Designové komponenty aplikace" },
  ];
  
  // Admin položka
  const adminNavigationItem = { name: "Administrace", href: "/admin", icon: ShieldIcon, description: "Správa aplikace" };
  
  // Funkce pro určení aktivní položky
  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  // Komponenta pro zobrazení navigační položky
  const NavigationItem = ({ item, showDescription = false }: { item: any, showDescription?: boolean }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    
    return (
      <Link
        to={item.href}
        onClick={closeSidebar}
        className={cn(
          "flex flex-col items-start text-sm px-3 py-2 rounded-md transition-colors",
          active 
            ? "bg-primary text-primary-foreground" 
            : "text-sidebar-foreground hover:bg-sidebar-hover"
        )}
      >
        <div className="flex items-center w-full">
          <Icon className={cn("h-4 w-4 mr-3", active ? "text-primary-foreground" : "text-sidebar-foreground/70")} />
          <span className="font-medium">{item.name}</span>
        </div>
        {showDescription && item.description && (
          <p className={cn(
            "text-xs mt-1 ml-7 leading-tight",
            active ? "text-primary-foreground/80" : "text-sidebar-foreground/60"
          )}>
            {item.description}
          </p>
        )}
      </Link>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Admin položka na začátku navigace */}
      {isAdmin && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-sidebar-foreground/60 pl-3 pb-1">Administrace</p>
          <NavigationItem item={adminNavigationItem} showDescription />
        </div>
      )}

      {/* Hlavní navigace */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-sidebar-foreground/60 pl-3 pb-1">Hlavní</p>
        {mainNavigation.map((item) => (
          <NavigationItem key={item.name} item={item} showDescription />
        ))}
      </div>
      
      {/* Pracovní sekce */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-sidebar-foreground/60 pl-3 pb-1">Práce & Finance</p>
        {workSections.map((item) => (
          <NavigationItem key={item.name} item={item} showDescription />
        ))}
      </div>

      {/* Osobní rozvoj */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-sidebar-foreground/60 pl-3 pb-1">Vzdělávání & Jazyk</p>
        {personalSections.map((item) => (
          <NavigationItem key={item.name} item={item} showDescription />
        ))}
      </div>

      {/* Ostatní nástroje */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-sidebar-foreground/60 pl-3 pb-1">Nástroje & Komunita</p>
        {toolsSections.map((item) => (
          <NavigationItem key={item.name} item={item} showDescription />
        ))}
      </div>
    </div>
  );
};

export default SidebarNavigation;
