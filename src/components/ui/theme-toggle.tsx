
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  alwaysShow?: boolean; // Show on mobile devices
  className?: string;
}

export function ThemeToggle({ 
  variant = 'ghost', 
  size = 'icon',
  alwaysShow = false,
  className
}: ThemeToggleProps) {
  const { theme, setTheme, isChangingTheme } = useTheme();
  const isMobile = useIsMobile();
  
  // Don't render if not supposed to show on mobile and we are on mobile
  if (!alwaysShow && isMobile) {
    return null;
  }
  
  const toggleTheme = () => {
    if (isChangingTheme) return;
    
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const ButtonComponent = (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={className}
      disabled={isChangingTheme}
      aria-label={theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-200 rotate-0" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-200 rotate-0" />
      )}
    </Button>
  );

  // Na mobilu v dropdown menu nepoužívat tooltip ani motion
  if (alwaysShow && isMobile) {
    return ButtonComponent;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {ButtonComponent}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
