import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputMode, ...props }, ref) => {
    // Auto-detect inputMode based on type if not provided
    const autoInputMode = React.useMemo(() => {
      if (inputMode) return inputMode
      
      switch (type) {
        case "email":
          return "email"
        case "tel":
          return "tel"
        case "number":
          return "numeric"
        case "url":
          return "url"
        case "search":
          return "search"
        default:
          return "text"
      }
    }, [type, inputMode])

    return (
      <input
        type={type}
        inputMode={autoInputMode}
        className={cn(
          "flex min-h-[var(--touch-target-min)] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
