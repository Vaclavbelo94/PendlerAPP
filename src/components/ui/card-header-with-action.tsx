
import React from "react";
import { Button } from "@/components/ui/button";
import { FlexContainer } from "@/components/ui/flex-container";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface CardHeaderWithActionProps {
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

export const CardHeaderWithAction = ({ 
  title, 
  description, 
  action, 
  className 
}: CardHeaderWithActionProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn("p-6 pb-4", className)}>
      <FlexContainer 
        direction={isMobile ? "col" : "row"} 
        justify={isMobile ? "start" : "between"} 
        align={isMobile ? "start" : "center"}
        gap="sm"
        className="w-full"
      >
        <div className={cn("space-y-1", isMobile ? "w-full mb-3" : "flex-1")}>
          <h3 className={cn(
            "font-semibold leading-none tracking-tight",
            isMobile ? "text-base" : "text-lg"
          )}>
            {title}
          </h3>
          {description && (
            <p className={cn(
              "text-muted-foreground",
              isMobile ? "text-xs" : "text-sm"
            )}>
              {description}
            </p>
          )}
        </div>
        
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || "outline"}
            size={isMobile ? "sm" : "default"}
            className={cn(
              "min-h-[44px]",
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
