import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "~/lib/utils"

import { Spinner } from "./Spinner"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/30",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        success:
          "bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 focus-visible:ring-emerald-500/40",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9"
      },
      bleed: {
        true: "w-full",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      bleed: false
    }
  }
)

function Button({
  className,
  variant,
  size,
  bleed,
  asChild = false,
  loading = false,
  leftIcon,
  rightIcon,
  spinnerProps,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    bleed?: boolean
    loading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    spinnerProps?: React.ComponentProps<typeof Spinner>
  }) {
  const Comp = asChild ? Slot : "button"
  const iconClass =
    "inline-flex items-center text-current [&>svg]:size-4 [&>svg]:shrink-0"
  const {
    size: spinnerSizeProp,
    variant: spinnerVariantProp,
    ...restSpinnerProps
  } = spinnerProps ?? {}
  const resolvedSpinnerVariant =
    spinnerVariantProp ??
    (variant === "default" ||
    variant === "destructive" ||
    variant === "secondary" ||
    variant === "success"
      ? "white"
      : "primary")
  const resolvedSpinnerSize = spinnerSizeProp ?? "sm"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, bleed, className }))}
      {...props}>
      {loading && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Spinner
            size={resolvedSpinnerSize}
            variant={resolvedSpinnerVariant}
            {...restSpinnerProps}
          />
        </span>
      )}
      <span
        className={cn("flex items-center gap-2", loading && "opacity-0")}
        aria-live={loading ? "polite" : undefined}>
        {leftIcon && <span className={iconClass}>{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {rightIcon && <span className={iconClass}>{rightIcon}</span>}
      </span>
    </Comp>
  )
}

export { Button, buttonVariants }
