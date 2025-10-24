import * as React from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  hasError?: boolean;
  isValid?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasError, isValid, errorMessage, leftIcon, ...props }, ref) => {
    // Ensure leftIcon is always displayed if provided
    const shouldShowLeftIcon = leftIcon !== undefined && leftIcon !== null;
    
    return (
      <div className="relative w-full">
        {shouldShowLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground z-10">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border bg-transparent py-1 text-base shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            shouldShowLeftIcon ? "pl-10" : "px-3",
            hasError ? "pr-10" : (isValid ? "pr-10" : "pr-3"),
            hasError && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500",
            isValid && !hasError && "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500",
            !hasError && !isValid && "border-input focus-visible:ring-ring",
            className
          )}
          ref={ref}
          {...props}
        />
        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
        {isValid && !hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
