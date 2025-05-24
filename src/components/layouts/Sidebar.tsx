
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarThemeSwitcher from "./sidebar/SidebarThemeSwitcher";
import SidebarUserSection from "./sidebar/SidebarUserSection";

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`h-full ${isMobile ? 'w-72' : 'w-64'} bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col`}>
      <div className={`${isMobile ? 'p-3' : 'p-4'} flex items-center justify-between`}>
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
      
      <ScrollArea className={`flex-1 ${isMobile ? 'px-2 py-3' : 'px-3 py-4'}`}>
        <div className="space-y-4">
          <SidebarNavigation closeSidebar={closeSidebar} />
          
          <Separator className="bg-sidebar-border" />
          
          <div className="space-y-1">
            <p className={`text-xs font-medium text-sidebar-foreground/60 pl-4 pb-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
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
