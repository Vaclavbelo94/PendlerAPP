
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  Calculator,
  Calendar,
  Book,
  Car,
  FileText,
  Settings,
  MapPin,
  Languages
} from "lucide-react";

interface SidebarNavigationProps {
  closeSidebar: () => void;
}

const SidebarNavigation = ({ closeSidebar }: SidebarNavigationProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const mainNavigation = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Moje směny",
      href: "/shifts",
      icon: Calendar,
    },
    {
      title: "Moje slovíčka",
      href: "/vocabulary",
      icon: Book,
    },
    {
      title: "Překladač",
      href: "/translator",
      icon: Languages,
    },
  ];

  const toolsNavigation = [
    {
      title: "Kalkulačka mezd",
      href: "/calculator",
      icon: Calculator,
    },
    {
      title: "Daňový poradce",
      href: "/tax-advisor",
      icon: FileText,
    },
    {
      title: "Moje vozidlo",
      href: "/vehicle",
      icon: Car,
    },
    {
      title: "Moje cesty",
      href: "/travel-planning",
      icon: MapPin,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const buttonSize = isMobile ? "sm" : "sm";
  const buttonClassName = isMobile ? "h-9 justify-start text-sm" : "justify-start";

  return (
    <div className="space-y-4">
      <div>
        <p className={`text-xs font-medium text-sidebar-foreground/60 pl-4 pb-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>
          Hlavní
        </p>
        <nav className="space-y-1">
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "secondary" : "ghost"}
                size={buttonSize}
                asChild
                className={cn(
                  buttonClassName,
                  "w-full text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Link to={item.href} onClick={closeSidebar}>
                  <Icon className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} mr-2`} />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>

      <div>
        <p className={`text-xs font-medium text-sidebar-foreground/60 pl-4 pb-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>
          Nástroje
        </p>
        <nav className="space-y-1">
          {toolsNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "secondary" : "ghost"}
                size={buttonSize}
                asChild
                className={cn(
                  buttonClassName,
                  "w-full text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  isActive(item.href) && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Link to={item.href} onClick={closeSidebar}>
                  <Icon className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} mr-2`} />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>

      <div>
        <p className={`text-xs font-medium text-sidebar-foreground/60 pl-4 pb-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>
          Ostatní
        </p>
        <nav className="space-y-1">
          <Button
            variant={isActive("/settings") ? "secondary" : "ghost"}
            size={buttonSize}
            asChild
            className={cn(
              buttonClassName,
              "w-full text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
              isActive("/settings") && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <Link to="/settings" onClick={closeSidebar}>
              <Settings className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} mr-2`} />
              Nastavení
            </Link>
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default SidebarNavigation;
