
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
  // Použijeme dynamicky vygenerované třídy místo interpolace, protože Tailwind může optimalizovat pouze statické třídy
  const gridColsClasses = [
    `grid-cols-${columns.mobile || 1}`,
    `sm:grid-cols-${columns.sm || 2}`,
    `md:grid-cols-${columns.md || 2}`,
    `lg:grid-cols-${columns.lg || 3}`,
    `xl:grid-cols-${columns.xl || 4}`,
  ];
  
  return (
    <div
      className={cn(
        "grid",
        ...gridColsClasses,
        gap,
        className
      )}
      style={{
        // Zajistíme, že třídy grid-cols-XX jsou správně aplikované pomocí custom stylů
        gridTemplateColumns: `repeat(${columns.mobile || 1}, minmax(0, 1fr))`,
        // Přidáme media queries pro responzivní chování
        [`@media (min-width: 640px)`]: {
          gridTemplateColumns: `repeat(${columns.sm || 2}, minmax(0, 1fr))`,
        },
        [`@media (min-width: 768px)`]: {
          gridTemplateColumns: `repeat(${columns.md || 2}, minmax(0, 1fr))`,
        },
        [`@media (min-width: 1024px)`]: {
          gridTemplateColumns: `repeat(${columns.lg || 3}, minmax(0, 1fr))`,
        },
        [`@media (min-width: 1280px)`]: {
          gridTemplateColumns: `repeat(${columns.xl || 4}, minmax(0, 1fr))`,
        },
      }}
      {...props}
    >
      {children}
    </div>
  )
}
