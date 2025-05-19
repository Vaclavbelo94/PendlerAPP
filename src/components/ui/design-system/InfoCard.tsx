
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Heading, Text } from './Typography';
import { ColorVariant } from '@/lib/design-system';
import { motion } from 'framer-motion';

export interface InfoCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  variant?: ColorVariant;
  interactive?: boolean;
  gradient?: boolean;
  onClick?: () => void;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  iconClassName?: string;
}

export const InfoCard = ({
  title,
  description,
  icon,
  children,
  footer,
  className,
  variant = 'primary',
  interactive = false,
  gradient = false,
  onClick,
  headerClassName,
  contentClassName,
  footerClassName,
  titleClassName,
  iconClassName,
}: InfoCardProps) => {
  // Mapování variant na barvy
  const variantClasses = {
    primary: {
      header: 'border-b-primary/20',
      icon: 'bg-primary/10 text-primary',
      gradient: 'from-primary/10 to-transparent',
    },
    secondary: {
      header: 'border-b-secondary/20',
      icon: 'bg-secondary/10 text-secondary',
      gradient: 'from-secondary/10 to-transparent',
    },
    accent: {
      header: 'border-b-accent/20',
      icon: 'bg-accent/10 text-accent',
      gradient: 'from-accent/10 to-transparent',
    },
    muted: {
      header: 'border-b-muted/20',
      icon: 'bg-muted/20 text-muted-foreground',
      gradient: 'from-muted/10 to-transparent',
    },
    danger: {
      header: 'border-b-destructive/20',
      icon: 'bg-destructive/10 text-destructive',
      gradient: 'from-destructive/10 to-transparent',
    },
  };
  
  // Wrapper komponenta - animovaná nebo ne
  const CardComponent = interactive ? motion.div : React.Fragment;
  
  // Props pro wrapper
  const wrapperProps = interactive 
    ? { 
        whileHover: { y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
        whileTap: { y: -2, boxShadow: '0 5px 15px rgba(0,0,0,0.05)' },
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }
    : {};
    
  return (
    <CardComponent {...wrapperProps}>
      <Card 
        className={cn(
          'overflow-hidden border',
          gradient && `bg-gradient-to-b ${variantClasses[variant].gradient}`,
          interactive && 'transition-all cursor-pointer hover:border-accent/30',
          className
        )}
        onClick={onClick}
      >
        {(title || icon || description) && (
          <CardHeader className={cn('flex flex-row items-center gap-4', headerClassName)}>
            {icon && (
              <div className={cn(
                'p-2 rounded-md',
                variantClasses[variant].icon,
                iconClassName
              )}>
                {icon}
              </div>
            )}
            <div className="space-y-1">
              {title && (
                <CardTitle className={titleClassName}>
                  <Heading level={4} className="mt-0">
                    {title}
                  </Heading>
                </CardTitle>
              )}
              {description && (
                <CardDescription>
                  <Text variant="muted" size="sm">
                    {description}
                  </Text>
                </CardDescription>
              )}
            </div>
          </CardHeader>
        )}
        
        {children && (
          <CardContent className={cn(contentClassName)}>
            {children}
          </CardContent>
        )}
        
        {footer && (
          <CardFooter className={cn('border-t bg-muted/10', footerClassName)}>
            {footer}
          </CardFooter>
        )}
      </Card>
    </CardComponent>
  );
};

export default InfoCard;
