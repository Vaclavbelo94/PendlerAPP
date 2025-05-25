
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

  const logoImageClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
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
          <div className={cn('relative', logoImageClasses[size])}>
            <img 
              src="/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png" 
              alt="PendlerApp Logo" 
              className={cn('object-contain', logoImageClasses[size])}
              onError={(e) => {
                // Fallback pokud se obrázek nenačte
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold ${logoImageClasses[size]}">
                    <span class="font-poppins tracking-tighter">PA</span>
                  </div>
                `;
              }}
            />
          </div>
        );
      
      case 'full':
        return (
          <>
            <div className={cn('relative', logoImageClasses[size])}>
              <img 
                src="/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png" 
                alt="PendlerApp Logo" 
                className={cn('object-contain', logoImageClasses[size])}
                onError={(e) => {
                  // Fallback pokud se obrázek nenačte
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold ${logoImageClasses[size]}">
                      <span class="font-poppins tracking-tighter">PA</span>
                    </div>
                  `;
                }}
              />
            </div>
            <div className="flex flex-col items-start">
              <span className={cn(
                "font-poppins font-bold leading-none tracking-tight",
                size === 'sm' && "text-base",
                size === 'md' && "text-lg",
                size === 'lg' && "text-xl",
                size === 'xl' && "text-2xl"
              )}>
                PendlerApp
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
            <div className={cn('relative', logoImageClasses[size])}>
              <img 
                src="/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png" 
                alt="PendlerApp Logo" 
                className={cn('object-contain', logoImageClasses[size])}
                onError={(e) => {
                  // Fallback pokud se obrázek nenačte
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold ${logoImageClasses[size]}">
                      <span class="font-poppins tracking-tighter">PA</span>
                    </div>
                  `;
                }}
              />
            </div>
            <span className={cn(
              "font-poppins font-bold leading-none tracking-tight",
              size === 'sm' && "text-base",
              size === 'md' && "text-lg",
              size === 'lg' && "text-xl",
              size === 'xl' && "text-2xl"
            )}>
              PendlerApp
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
