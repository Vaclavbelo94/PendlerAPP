
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  Languages, 
  BookOpenIcon, 
  CarFrontIcon, 
  CalendarClockIcon, 
  InfoIcon, 
  HelpCircleIcon, 
  PhoneIcon
} from "lucide-react";

interface NavigationItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

interface SidebarNavigationProps {
  closeSidebar: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ closeSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems: NavigationItem[] = [
    { title: "Domů", path: "/", icon: HomeIcon },
    { title: "Výuka němčiny", path: "/language", icon: Languages },
    { title: "Překladač", path: "/translator", icon: Languages },
    { title: "Přehled zákonů", path: "/laws", icon: BookOpenIcon },
    { title: "Správa vozidla", path: "/vehicle", icon: CarFrontIcon },
    { title: "Plánování směn", path: "/shifts", icon: CalendarClockIcon },
  ];
  
  const secondaryItems: NavigationItem[] = [
    { title: "O projektu", path: "/about", icon: InfoIcon },
    { title: "Často kladené otázky", path: "/faq", icon: HelpCircleIcon },
    { title: "Kontakt", path: "/contact", icon: PhoneIcon },
  ];

  const handleNavigate = (path: string) => (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    navigate(path);
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <>
      <div className="space-y-1">
        <p className="text-xs font-medium text-sidebar-foreground/60 pl-4 pb-1">Hlavní navigace</p>
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? "secondary" : "ghost"}
            size="sm"
            className={`w-full justify-start gap-3 ${
              location.pathname === item.path
                ? "font-medium"
                : "font-normal"
            } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
            onClick={handleNavigate(item.path)}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Button>
        ))}
      </div>
      
      <div className="space-y-1">
        <p className="text-xs font-medium text-sidebar-foreground/60 pl-4 pb-1">Informace</p>
        {secondaryItems.map((item) => (
          <Button
            key={item.path}
            variant={location.pathname === item.path ? "secondary" : "ghost"}
            size="sm"
            className={`w-full justify-start gap-3 ${
              location.pathname === item.path
                ? "font-medium"
                : "font-normal"
            } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
            onClick={handleNavigate(item.path)}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Button>
        ))}
      </div>
    </>
  );
};

export default SidebarNavigation;
