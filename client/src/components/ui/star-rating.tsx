import * as React from "react"
import { Star } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { cn } from "@/lib/utils"

export interface StarRatingProps {
  value?: number
  onValueChange?: (value: number) => void
  maxStars?: number
  size?: "sm" | "md" | "lg"
  readonly?: boolean
  className?: string
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
}

export function StarRating({
  value = 0,
  onValueChange,
  maxStars = 5,
  size = "md",
  readonly = false,
  className,
}: StarRatingProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null)

  const displayValue = hoveredValue ?? value

  if (readonly) {
    return (
      <div
        className={cn("flex items-center space-x-1", className)}
        role="img"
        aria-label={`Rating: ${value.toFixed(1)} out of ${maxStars} stars`}
      >
        {Array.from({ length: maxStars }, (_, i) => {
          const starValue = i + 1
          const isFilled = starValue <= displayValue

          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
              aria-hidden="true"
            />
          )
        })}
        <span className="ml-2 text-sm text-gray-600" aria-hidden="true">
          {value.toFixed(1)}
        </span>
      </div>
    )
  }

  return (
    <fieldset className={cn("flex items-center space-x-1", className)}>
      <legend className="sr-only">Rate this item out of {maxStars} stars</legend>
      <RadioGroup
        value={value.toString()}
        onValueChange={(newValue) => onValueChange?.(parseInt(newValue))}
        className="flex items-center space-x-1"
      >
        {Array.from({ length: maxStars }, (_, i) => {
          const starValue = i + 1
          const isFilled = starValue <= displayValue

          return (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => setHoveredValue(starValue)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              <RadioGroupItem
                value={starValue.toString()}
                id={`star-${starValue}`}
                className="sr-only"
                aria-describedby={`star-${starValue}-description`}
              />
              <label
                htmlFor={`star-${starValue}`}
                className="cursor-pointer block"
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    "transition-colors",
                    isFilled
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  )}
                  aria-hidden="true"
                />
              </label>
              <span
                id={`star-${starValue}-description`}
                className="sr-only"
              >
                {starValue} star{starValue !== 1 ? 's' : ''}
              </span>
            </div>
          )
        })}
        <span
          className="ml-2 text-sm text-gray-600 min-w-[2rem]"
          aria-live="polite"
          aria-atomic="true"
        >
          {displayValue > 0 ? displayValue : ""}
        </span>
      </RadioGroup>
    </fieldset>
  )
}
