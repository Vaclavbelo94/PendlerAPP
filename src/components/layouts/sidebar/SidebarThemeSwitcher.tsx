
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const SidebarThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isChanging, setIsChanging] = React.useState(false);
  
  const handleToggleTheme = () => {
    if (isChanging) return;
    
    setIsChanging(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
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
