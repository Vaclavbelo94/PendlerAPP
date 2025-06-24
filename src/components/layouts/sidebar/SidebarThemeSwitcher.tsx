
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const SidebarThemeSwitcher = () => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="w-full justify-start text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/30 hover:to-sidebar-accent/20 hover:scale-[1.02] transition-all duration-300 group"
      onClick={() => {
        // Placeholder for settings action
        console.log('Settings clicked');
      }}
    >
      <Settings className="h-4 w-4 mr-3 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
      <span className="font-medium">Nastavení</span>
    </Button>
  );
};

export default SidebarThemeSwitcher;
