
import React from 'react';
import { cn } from '@/lib/utils';
import { ColorVariant } from '@/lib/design-system';
import { VariantProps, cva } from 'class-variance-authority';

// Definujeme varianty pro IconBox
const iconBoxVariants = cva(
  // Základní styl
  "flex items-center justify-center rounded-md", 
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        accent: "bg-accent/10 text-accent",
        muted: "bg-muted text-muted-foreground",
        danger: "bg-destructive/10 text-destructive",
      },
      size: {
        sm: "p-1.5 w-7 h-7",
        md: "p-2 w-9 h-9",
        lg: "p-2.5 w-11 h-11",
        xl: "p-3 w-14 h-14",
      },
      shape: {
        default: "rounded-md",
        square: "rounded-md",
        circle: "rounded-full",
        pill: "rounded-full px-4",
      },
      glow: {
        true: "shadow-lg",
        false: "",
      },
      border: {
        true: "border",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "default",
      glow: false,
      border: false,
    }
  }
);

// Rozšiřujeme základní props o varianty z class-variance-authority
export interface IconBoxProps extends
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof iconBoxVariants> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const IconBox: React.FC<IconBoxProps> = ({
  variant = "default", 
  size = "md", 
  shape = "default",
  glow = false,
  border = false,
  icon,
  children,
  className,
  gradient = false,
  ...props
}) => {
  // Mapování variant na názvy barev pro gradienty
  const variantGradients = {
    default: "from-primary/20 to-primary/5",
    primary: "from-primary/20 to-primary/5",
    secondary: "from-secondary/20 to-secondary/5",
    accent: "from-accent/20 to-accent/5",
    muted: "from-muted/30 to-muted/10",
    danger: "from-destructive/20 to-destructive/5",
  };
  
  return (
    <div 
      className={cn(
        iconBoxVariants({ variant, size, shape, glow, border }),
        gradient && `bg-gradient-to-br ${variantGradients[variant as keyof typeof variantGradients]}`,
        border && variant === "primary" && "border-primary/30",
        border && variant === "secondary" && "border-secondary/30",
        border && variant === "accent" && "border-accent/30", 
        border && variant === "muted" && "border-muted/30",
        border && variant === "danger" && "border-destructive/30",
        glow && variant === "primary" && "shadow-primary/30",
        glow && variant === "secondary" && "shadow-secondary/30",
        glow && variant === "accent" && "shadow-accent/30",
        glow && variant === "muted" && "shadow-muted/20",
        glow && variant === "danger" && "shadow-destructive/30",
        className
      )} 
      {...props}
    >
      {icon || children}
    </div>
  );
};

export default IconBox;
