
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SidebarThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Světlý', icon: Sun },
    { value: 'dark', label: 'Tmavý', icon: Moon },
    { value: 'system', label: 'Systém', icon: Monitor },
  ];

  const currentTheme = themeOptions.find(option => option.value === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-sidebar-foreground hover:bg-gradient-to-r hover:from-sidebar-accent/30 hover:to-sidebar-accent/20 hover:scale-[1.02] transition-all duration-300 group"
        >
          <CurrentIcon className="h-4 w-4 mr-3 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
          <span className="font-medium">Téma: {currentTheme?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-48 bg-sidebar/95 backdrop-blur-sm border-sidebar-border/50 shadow-xl"
      >
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;
          
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value as any)}
              className={`flex items-center gap-3 cursor-pointer transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary font-medium" 
                  : "hover:bg-sidebar-accent/30"
              }`}
            >
              <Icon className={`h-4 w-4 transition-all duration-300 ${
                isActive ? "text-primary animate-pulse" : ""
              }`} />
              <span>{option.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarThemeSwitcher;
