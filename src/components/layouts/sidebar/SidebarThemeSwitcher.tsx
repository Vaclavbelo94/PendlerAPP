
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const SidebarThemeSwitcher: React.FC = () => {
  const { theme, setTheme, isChangingTheme } = useTheme();
  
  const handleToggleTheme = () => {
    if (isChangingTheme) return;
    
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      onClick={handleToggleTheme}
      disabled={isChangingTheme}
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
