
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-query';
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
  const { theme, setTheme } = useTheme();
  const isDesktop = useMediaQuery("md");
  const [isChangingTheme, setIsChangingTheme] = React.useState(false);
  
  // Don't render if not supposed to show on mobile and we are on mobile
  if (!alwaysShow && !isDesktop) {
    return null;
  }
  
  const toggleTheme = () => {
    if (isChangingTheme) return;
    
    setIsChangingTheme(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => {
      setIsChangingTheme(false);
    }, 300);
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
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
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
