
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarThemeSwitcher from "./sidebar/SidebarThemeSwitcher";
import SidebarUserSection from "./sidebar/SidebarUserSection";

interface SidebarProps {
  closeSidebar: () => void;
  isLandscapeSheet?: boolean;
}

const Sidebar = ({ closeSidebar, isLandscapeSheet = false }: SidebarProps) => {
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  
  // Určit orientaci a přizpůsobit rozměry
  const isLandscapeMobile = isMobile && orientation === "landscape";
  const isPortraitMobile = isMobile && orientation === "portrait";
  
  // Určit šířku a padding na základě orientace
  const sidebarWidth = isLandscapeSheet 
    ? 'w-full' 
    : isPortraitMobile 
      ? 'w-80' // Širší pro portrait mobile pro lepší použitelnost
      : isLandscapeMobile 
        ? 'w-60' 
        : 'w-64';
        
  const contentPadding = isLandscapeSheet 
    ? 'p-3' 
    : isPortraitMobile 
      ? 'p-4' // Více paddingu pro portrait
      : isLandscapeMobile 
        ? 'p-2' 
        : 'p-4';
        
  const scrollPadding = isLandscapeSheet 
    ? 'px-2 py-1' 
    : isPortraitMobile 
      ? 'px-4 py-4' // Větší padding pro lepší touch targets
      : isLandscapeMobile 
        ? 'px-1 py-2' 
        : 'px-3 py-4';
  
  // Layout pro landscape sheet - horizontální orientace s lepším využitím prostoru
  if (isLandscapeSheet) {
    return (
      <div className={`h-full ${sidebarWidth} bg-sidebar text-sidebar-foreground flex flex-col`}>
        <div className={`${contentPadding} flex items-center justify-between border-b border-sidebar-border`}>
          <SidebarLogo closeSidebar={closeSidebar} />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              closeSidebar();
            }} 
            className="text-sidebar-foreground h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 h-full">
            {/* Navigace - hlavní oblast */}
            <div className="space-y-2 lg:col-span-1">
              <p className="text-xs font-medium text-sidebar-foreground/60 pb-1">
                Navigace
              </p>
              <SidebarNavigation closeSidebar={closeSidebar} isHorizontal={true} />
            </div>
            
            {/* Nastavení a uživatel ve druhém sloupci */}
            <div className="space-y-3 lg:col-span-1">
              {/* Nastavení */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-sidebar-foreground/60 pb-1">
                  Nastavení
                </p>
                <SidebarThemeSwitcher />
              </div>
              
              {/* Uživatel */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-sidebar-foreground/60 pb-1">
                  Účet
                </p>
                <SidebarUserSection closeSidebar={closeSidebar} isCompact={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Optimalizovaný vertikální layout pro portrait mobile
  return (
    <div className={`h-full ${sidebarWidth} bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col shadow-lg`}>
      <div className={`${contentPadding} flex items-center justify-between border-b border-sidebar-border`}>
        <SidebarLogo closeSidebar={closeSidebar} />
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              closeSidebar();
            }} 
            className={`text-sidebar-foreground ${isPortraitMobile ? 'h-10 w-10' : 'h-8 w-8'}`}
          >
            <X className={isPortraitMobile ? "h-5 w-5" : "h-4 w-4"} />
          </Button>
        )}
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <ScrollArea className={`flex-1 ${scrollPadding}`}>
        <div className={`space-y-${isPortraitMobile ? '6' : '4'}`}>
          <SidebarNavigation closeSidebar={closeSidebar} />
          
          <Separator className="bg-sidebar-border" />
          
          <div className="space-y-2">
            <p className={`text-xs font-medium text-sidebar-foreground/60 pl-4 pb-1`}>
              Informace
            </p>
            <SidebarThemeSwitcher />
          </div>
        </div>
      </ScrollArea>
      
      <Separator className="bg-sidebar-border" />
      
      <SidebarUserSection closeSidebar={closeSidebar} />
    </div>
  );
};

export default Sidebar;
