import React from "react"

import { cn } from "~/utils/cn"

export interface CardListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  dividers?: boolean
}

const CardList = React.forwardRef<HTMLDivElement, CardListProps>(
  ({ className, children, dividers = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          dividers
            ? "divide-y divide-gray-200 dark:divide-dark-bg-tertiary"
            : "",
          className
        )}
        {...props}>
        {children}
      </div>
    )
  }
)
CardList.displayName = "CardList"

export { CardList }
