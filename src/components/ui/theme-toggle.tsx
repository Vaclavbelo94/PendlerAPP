
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/useLanguage';
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
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // Don't render if not supposed to show on mobile and we are on mobile
  if (!alwaysShow && isMobile) {
    return null;
  }
  
  const toggleTheme = () => {
    if (isChangingTheme) return;
    
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const lightModeLabel = t('switchToLightMode') || 'Přepnout na světlý režim';
  const darkModeLabel = t('switchToDarkMode') || 'Přepnout na tmavý režim';
  
  const ButtonComponent = (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={className}
      disabled={isChangingTheme}
      aria-label={theme === 'dark' ? lightModeLabel : darkModeLabel}
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
          <p>{theme === 'dark' ? lightModeLabel : darkModeLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
