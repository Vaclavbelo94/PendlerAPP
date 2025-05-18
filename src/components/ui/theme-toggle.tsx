
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
  const { theme, toggleTheme } = useTheme();
  const isDesktop = useMediaQuery("md");
  
  // Don't render if not supposed to show on mobile and we are on mobile
  if (!alwaysShow && !isDesktop) {
    return null;
  }
  
  return (
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
  );
}
