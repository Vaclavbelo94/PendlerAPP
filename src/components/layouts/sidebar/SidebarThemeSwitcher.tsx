
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const SidebarThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isChanging, setIsChanging] = useState(false);
  
  const handleToggleTheme = () => {
    if (isChanging) return;
    
    setIsChanging(true);
    toggleTheme();
    setTimeout(() => {
      setIsChanging(false);
    }, 300);
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      onClick={handleToggleTheme}
      disabled={isChanging}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" />
          Světlý režim
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          Tmavý režim
        </>
      )}
    </Button>
  );
};

export default SidebarThemeSwitcher;
