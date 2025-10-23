import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

import { cn } from "~/utils/cn"

import { BodySmall, Heading3 } from "./Typography"

const cardVariants = cva(
  "rounded-lg border bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary",
  {
    variants: {
      variant: {
        default: "border-gray-200 dark:border-dark-bg-tertiary shadow-sm",
        elevated: "border-gray-200 dark:border-dark-bg-tertiary shadow-md",
        interactive:
          "border-gray-200 dark:border-dark-bg-tertiary shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        outlined: "border-gray-300 dark:border-gray-600 shadow-none",
        ghost: "border-transparent shadow-none"
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-4",
        md: "p-6",
        lg: "p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default"
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <Heading3
    ref={ref}
    className={cn("leading-none tracking-tight", className)}
    {...props}>
    {children}
  </Heading3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <BodySmall
    ref={ref}
    className={cn("text-gray-600 dark:text-dark-text-secondary", className)}
    {...props}>
    {children}
  </BodySmall>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end space-x-3", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
