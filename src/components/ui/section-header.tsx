
import React from "react";
import { Button } from "@/components/ui/button";
import { FlexContainer } from "@/components/ui/flex-container";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "outline" | "secondary";
  };
  className?: string;
}

export const SectionHeader = ({ title, description, action, className }: SectionHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn("space-y-3 mb-6", className)}>
      <FlexContainer 
        direction={isMobile ? "col" : "row"} 
        justify={isMobile ? "start" : "between"} 
        align={isMobile ? "start" : "center"}
        gap={isMobile ? "sm" : "md"}
        className="w-full"
      >
        <div className={cn("space-y-1", isMobile ? "w-full" : "flex-1")}>
          <h1 className={cn(
            "font-bold tracking-tight",
            isMobile ? "text-xl" : "text-3xl"
          )}>
            {title}
          </h1>
          {description && (
            <p className={cn(
              "text-muted-foreground",
              isMobile ? "text-sm" : "text-base"
            )}>
              {description}
            </p>
          )}
        </div>
        
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || "default"}
            size={isMobile ? "sm" : "default"}
            className={cn(
              "min-h-[44px]", // Přístupná velikost pro mobilní dotyky
              isMobile ? "w-full" : "shrink-0"
            )}
          >
            {action.icon && <span className="mr-2 flex items-center">{action.icon}</span>}
            {action.label}
          </Button>
        )}
      </FlexContainer>
    </div>
  );
};
