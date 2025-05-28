
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
      ? 'w-80' 
      : isLandscapeMobile 
        ? 'w-60' 
        : 'w-64';
        
  const contentPadding = isLandscapeSheet 
    ? 'p-3' 
    : isPortraitMobile 
      ? 'p-4' 
      : isLandscapeMobile 
        ? 'p-2' 
        : 'p-4';
        
  const scrollPadding = isLandscapeSheet 
    ? 'px-2 py-1' 
    : isPortraitMobile 
      ? 'px-4 py-4' 
      : isLandscapeMobile 
        ? 'px-1 py-2' 
        : 'px-3 py-4';
  
  // Layout pro landscape sheet - horizontální orientace
  if (isLandscapeSheet) {
    return (
      <div className={`h-full ${sidebarWidth} bg-gradient-to-br from-sidebar via-sidebar/95 to-sidebar/90 text-sidebar-foreground flex flex-col backdrop-blur-sm border-r border-sidebar-border/50 shadow-xl`}>
        <div className={`${contentPadding} flex items-center justify-between border-b border-sidebar-border/30 bg-gradient-to-r from-sidebar-accent/10 to-transparent backdrop-blur-sm`}>
          <SidebarLogo closeSidebar={closeSidebar} />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              closeSidebar();
            }} 
            className="text-sidebar-foreground h-8 w-8 hover:bg-sidebar-accent/20 hover:scale-110 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 h-full">
            {/* Navigace - hlavní oblast */}
            <div className="space-y-2 lg:col-span-1">
              <p className="text-xs font-medium text-sidebar-foreground/60 pb-1 px-2">
                Navigace
              </p>
              <SidebarNavigation closeSidebar={closeSidebar} isHorizontal={true} />
            </div>
            
            {/* Nastavení a uživatel ve druhém sloupci */}
            <div className="space-y-3 lg:col-span-1">
              {/* Nastavení */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-sidebar-foreground/60 pb-1 px-2">
                  Nastavení
                </p>
                <div className="bg-sidebar-accent/10 rounded-lg p-2 backdrop-blur-sm">
                  <SidebarThemeSwitcher />
                </div>
              </div>
              
              {/* Uživatel */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-sidebar-foreground/60 pb-1 px-2">
                  Účet
                </p>
                <div className="bg-sidebar-accent/10 rounded-lg p-2 backdrop-blur-sm">
                  <SidebarUserSection closeSidebar={closeSidebar} isCompact={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Optimalizovaný vertikální layout pro portrait mobile a desktop
  return (
    <div className={`h-full ${sidebarWidth} bg-gradient-to-b from-sidebar via-sidebar/98 to-sidebar/95 text-sidebar-foreground border-r border-sidebar-border/50 flex flex-col shadow-2xl backdrop-blur-sm relative overflow-hidden`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      {/* Header with logo and close button */}
      <div className={`${contentPadding} flex items-center justify-between border-b border-sidebar-border/30 bg-gradient-to-r from-sidebar-accent/10 to-transparent backdrop-blur-sm relative z-10`}>
        <SidebarLogo closeSidebar={closeSidebar} />
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              closeSidebar();
            }} 
            className={`text-sidebar-foreground hover:bg-sidebar-accent/20 hover:scale-110 transition-all duration-200 ${isPortraitMobile ? 'h-10 w-10' : 'h-8 w-8'}`}
          >
            <X className={isPortraitMobile ? "h-5 w-5" : "h-4 w-4"} />
          </Button>
        )}
      </div>
      
      <Separator className="bg-gradient-to-r from-transparent via-sidebar-border to-transparent" />
      
      {/* Main navigation content */}
      <ScrollArea className={`flex-1 ${scrollPadding} relative z-10`}>
        <div className={`space-y-${isPortraitMobile ? '6' : '4'}`}>
          <div className="bg-sidebar-accent/5 rounded-xl p-3 backdrop-blur-sm border border-sidebar-border/20">
            <SidebarNavigation closeSidebar={closeSidebar} />
          </div>
          
          <Separator className="bg-gradient-to-r from-transparent via-sidebar-border/50 to-transparent my-4" />
          
          <div className="space-y-3">
            <p className={`text-xs font-medium text-sidebar-foreground/60 pl-4 pb-1`}>
              Nastavení & Informace
            </p>
            <div className="bg-sidebar-accent/5 rounded-xl p-3 backdrop-blur-sm border border-sidebar-border/20">
              <SidebarThemeSwitcher />
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <Separator className="bg-gradient-to-r from-transparent via-sidebar-border to-transparent" />
      
      {/* User section at bottom */}
      <div className="bg-gradient-to-r from-sidebar-accent/10 to-transparent backdrop-blur-sm relative z-10">
        <SidebarUserSection closeSidebar={closeSidebar} />
      </div>
    </div>
  );
};

export default Sidebar;
