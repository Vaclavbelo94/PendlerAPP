
import React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  as?: React.ElementType
  fluid?: boolean
}

export function ResponsiveContainer({
  children,
  className,
  as: Component = "div",
  fluid = false,
  ...props
}: ResponsiveContainerProps) {
  return (
    <Component
      className={cn(
        fluid 
          ? "w-full px-4 sm:px-6 lg:px-8" 
          : "container mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  columns?: {
    mobile?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: string
}

export function ResponsiveGrid({
  children,
  className,
  columns = { mobile: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  gap = "gap-6",
  ...props
}: ResponsiveGridProps) {
  // Generate responsive grid classes using Tailwind's built-in responsive prefixes
  const gridClasses = cn(
    "grid",
    gap,
    // Use grid-template-columns utility for the mobile (default) breakpoint
    `grid-cols-${columns.mobile || 1}`,
    // Then add responsive variants for each breakpoint
    columns.sm ? `sm:grid-cols-${columns.sm}` : "",
    columns.md ? `md:grid-cols-${columns.md}` : "",
    columns.lg ? `lg:grid-cols-${columns.lg}` : "",
    columns.xl ? `xl:grid-cols-${columns.xl}` : "",
    className
  );
  
  return (
    <div
      className={gridClasses}
      {...props}
    >
      {children}
    </div>
  )
}
