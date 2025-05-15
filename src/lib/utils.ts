
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper for responsive class generation
export function responsive(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string,
  xxl?: string
) {
  return cn(
    base,
    sm ? `sm:${sm}` : '',
    md ? `md:${md}` : '',
    lg ? `lg:${lg}` : '',
    xl ? `xl:${xl}` : '',
    xxl ? `2xl:${xxl}` : ''
  )
}

// Add responsive skeleton helper
export function responsiveSkeleton(isLoading: boolean, className?: string) {
  return isLoading ? cn("animate-pulse bg-muted rounded-md", className) : ""
}
