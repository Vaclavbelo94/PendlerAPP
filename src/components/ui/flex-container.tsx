
import React from "react";
import { cn } from "@/lib/utils";

interface FlexContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  wrap?: boolean;
}

export const FlexContainer = React.forwardRef<HTMLDivElement, FlexContainerProps>(
  ({ 
    children, 
    className, 
    direction = "row", 
    align = "center", 
    justify = "start", 
    gap = "md",
    wrap = false,
    ...props 
  }, ref) => {
    const directionClasses = {
      row: "flex-row",
      col: "flex-col"
    };

    const alignClasses = {
      start: "items-start",
      center: "items-center", 
      end: "items-end",
      stretch: "items-stretch"
    };

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end", 
      between: "justify-between",
      around: "justify-around"
    };

    const gapClasses = {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2", 
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClasses[direction],
          alignClasses[align],
          justifyClasses[justify],
          gapClasses[gap],
          wrap && "flex-wrap",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FlexContainer.displayName = "FlexContainer";
