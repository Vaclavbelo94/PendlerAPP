
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoVariant = 'default' | 'minimal' | 'full';

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  onClick?: () => void;
  className?: string;
  showTagline?: boolean;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'default',
  onClick,
  className,
  showTagline = true,
  animated = true,
}) => {
  // Mapování velikostí
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  };

  // Komponenta obalu - buď animovaná nebo statická
  const Wrapper = animated ? motion.div : React.Fragment;
  
  // Props pro obal
  const wrapperProps = animated 
    ? { 
        whileHover: { scale: 1.03 }, 
        whileTap: { scale: 0.98 },
        className: cn('flex items-center space-x-2', onClick && 'cursor-pointer', className),
        onClick
      } 
    : {};
  
  // Vykreslení podle varianty
  const renderLogo = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className={cn(
            'rounded-lg bg-gradient-to-br from-dhl-yellow to-amber-400 flex items-center justify-center text-black font-bold relative overflow-hidden shadow-md',
            sizeClasses[size]
          )}>
            <span className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 opacity-30"></span>
            <span className="relative z-10 font-poppins tracking-tighter">PH</span>
            {animated && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-dhl-red"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
        );
      
      case 'full':
        return (
          <>
            <div className={cn(
              'rounded-lg bg-gradient-to-br from-dhl-yellow to-amber-400 flex items-center justify-center text-black font-bold relative overflow-hidden shadow-md',
              sizeClasses[size]
            )}>
              <span className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 opacity-30"></span>
              <span className="relative z-10 font-poppins tracking-tighter">PH</span>
              {animated && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-dhl-red"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className={cn(
                "font-poppins font-bold leading-none tracking-tight",
                size === 'sm' && "text-base",
                size === 'md' && "text-lg",
                size === 'lg' && "text-xl",
                size === 'xl' && "text-2xl"
              )}>
                PendlerHelfer
              </span>
              {showTagline && (
                <span className="text-xs text-muted-foreground tracking-tight">Pro české pendlery</span>
              )}
            </div>
          </>
        );
        
      default:
        return (
          <>
            <div className={cn(
              'rounded-lg bg-gradient-to-br from-dhl-yellow to-amber-400 flex items-center justify-center text-black font-bold relative overflow-hidden shadow-md',
              sizeClasses[size]
            )}>
              <span className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 opacity-30"></span>
              <span className="relative z-10 font-poppins tracking-tighter">PH</span>
              {animated && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-dhl-red"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
            <span className={cn(
              "font-poppins font-bold leading-none tracking-tight",
              size === 'sm' && "text-base",
              size === 'md' && "text-lg",
              size === 'lg' && "text-xl",
              size === 'xl' && "text-2xl"
            )}>
              PendlerHelfer
            </span>
          </>
        );
    }
  };

  return (
    <Wrapper {...wrapperProps}>
      {renderLogo()}
    </Wrapper>
  );
};

export default Logo;
