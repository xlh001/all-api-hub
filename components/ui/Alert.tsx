import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react"
import React from "react"

import { cn } from "~/utils/cn"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default:
          "bg-white dark:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary border-gray-200 dark:border-dark-bg-tertiary",
        destructive:
          "bg-semantic-error-50 dark:bg-semantic-error-900/20 text-semantic-error-800 dark:text-semantic-error-200 border-semantic-error-200 dark:border-semantic-error-800",
        success:
          "bg-semantic-success-50 dark:bg-semantic-success-900/20 text-semantic-success-800 dark:text-semantic-success-200 border-semantic-success-200 dark:border-semantic-success-800",
        warning:
          "bg-semantic-warning-50 dark:bg-semantic-warning-900/20 text-semantic-warning-800 dark:text-semantic-warning-200 border-semantic-warning-200 dark:border-semantic-warning-800",
        info: "bg-semantic-info-50 dark:bg-semantic-info-900/20 text-semantic-info-800 dark:text-semantic-info-200 border-semantic-info-200 dark:border-semantic-info-800"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  description?: string
  showIcon?: boolean
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant,
      title,
      description,
      showIcon = true,
      children,
      ...props
    },
    ref
  ) => {
    const getIcon = () => {
      if (!showIcon) return null

      switch (variant) {
        case "destructive":
          return <AlertCircle className="h-4 w-4" />
        case "success":
          return <CheckCircle className="h-4 w-4" />
        case "warning":
          return <AlertTriangle className="h-4 w-4" />
        case "info":
          return <Info className="h-4 w-4" />
        default:
          return <Info className="h-4 w-4" />
      }
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}>
        {getIcon()}
        <div className="ml-0">
          {title && (
            <h5 className="mb-1 font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          {description && (
            <div className="text-sm [&_p]:leading-relaxed">{description}</div>
          )}
          {children}
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
