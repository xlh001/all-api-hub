import React from "react"

import { cn } from "~/utils/cn"

import { Button, type ButtonProps } from "./Button"

export interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: ButtonProps["variant"]
    icon?: React.ReactNode
  }
  className?: string
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-center py-12", className)}
        role="status"
        aria-live="polite">
        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-gray-300 dark:text-gray-600">
          {icon}
        </div>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mb-4">
          {title}
        </p>
        {description && (
          <p className="text-sm text-gray-400 dark:text-dark-text-tertiary mb-4">
            {description}
          </p>
        )}
        {action && (
          <Button
            variant={action.variant || "default"}
            onClick={action.onClick}
            leftIcon={action.icon}
            className="mx-auto">
            {action.label}
          </Button>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"
