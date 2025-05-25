
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
  
  // Určit šířku a padding na základě orientace
  const isLandscapeMobile = isMobile && orientation === "landscape";
  const sidebarWidth = isLandscapeSheet ? 'w-full' : isLandscapeMobile ? 'w-60' : isMobile ? 'w-72' : 'w-64';
  const contentPadding = isLandscapeSheet ? 'p-3' : isLandscapeMobile ? 'p-2' : isMobile ? 'p-3' : 'p-4';
  const scrollPadding = isLandscapeSheet ? 'px-2 py-1' : isLandscapeMobile ? 'px-1 py-2' : isMobile ? 'px-2 py-3' : 'px-3 py-4';
  
  // Layout pro landscape sheet - horizontální orientace
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full">
            {/* Navigace */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-sidebar-foreground/60 pb-1">
                Navigace
              </p>
              <SidebarNavigation closeSidebar={closeSidebar} isHorizontal={true} />
            </div>
            
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
    );
  }
  
  // Původní vertikální layout
  return (
    <div className={`h-full ${sidebarWidth} bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col`}>
      <div className={`${contentPadding} flex items-center justify-between`}>
        <SidebarLogo closeSidebar={closeSidebar} />
        {isMobile && (
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
        )}
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <ScrollArea className={`flex-1 ${scrollPadding}`}>
        <div className="space-y-4">
          <SidebarNavigation closeSidebar={closeSidebar} />
          
          <Separator className="bg-sidebar-border" />
          
          <div className="space-y-1">
            <p className={`text-xs font-medium text-sidebar-foreground/60 pl-4 pb-1 ${isLandscapeMobile ? 'text-xs' : 'text-xs'}`}>
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
