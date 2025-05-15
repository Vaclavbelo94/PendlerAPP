
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
  gap = "gap-4",
  ...props
}: ResponsiveGridProps) {
  const { mobile = 1, sm = 2, md = 3, lg = 4, xl = 4 } = columns
  
  return (
    <div
      className={cn(
        "grid",
        `grid-cols-${mobile}`,
        `sm:grid-cols-${sm}`,
        `md:grid-cols-${md}`,
        `lg:grid-cols-${lg}`,
        `xl:grid-cols-${xl}`,
        gap,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
