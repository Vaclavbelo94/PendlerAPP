
import React from 'react';
import { DiamondIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PremiumBadgeVariant = 'default' | 'compact' | 'icon' | 'rounded';

interface PremiumBadgeProps {
  variant?: PremiumBadgeVariant;
  className?: string;
}

/**
 * Konzistentní označení premium funkcí napříč aplikací
 */
export const PremiumBadge = ({ 
  variant = 'default',
  className 
}: PremiumBadgeProps) => {
  
  // Základní styly pro všechny varianty
  const baseStyles = "bg-amber-100 text-amber-800 border-amber-200";
  
  switch (variant) {
    case 'compact':
      // Kompaktní varianta pouze s ikonou a textem "Premium"
      return (
        <Badge className={cn(baseStyles, className)}>
          <DiamondIcon className="h-3 w-3 mr-1 text-amber-500" />
          Premium
        </Badge>
      );
      
    case 'icon':
      // Pouze ikona
      return (
        <div className={cn("p-1 rounded-full bg-amber-100", className)}>
          <DiamondIcon className="h-3 w-3 text-amber-500" />
        </div>
      );
      
    case 'rounded':
      // Zaoblená varianta s větším paddingem
      return (
        <div className={cn("inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200", className)}>
          <DiamondIcon className="h-4 w-4 mr-2 text-amber-500" />
          <span className="text-sm font-medium">Premium</span>
        </div>
      );
      
    default:
      // Standardní varianta používající Badge
      return (
        <Badge className={cn(baseStyles, className)}>
          <DiamondIcon className="h-3 w-3 mr-1 text-amber-500" />
          Premium
        </Badge>
      );
  }
};

export default PremiumBadge;
