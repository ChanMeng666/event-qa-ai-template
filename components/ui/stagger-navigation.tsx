"use client"

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StaggerNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-16 w-16',
} as const;

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export const StaggerNavigation: React.FC<StaggerNavigationProps> = ({
  onPrevious,
  onNext,
  className,
  size = 'md',
}) => {
  const buttonBaseClasses = cn(
    "flex items-center justify-center transition-colors",
    "bg-background border-2 border-border",
    "hover:bg-primary hover:text-primary-foreground hover:border-primary",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    sizeClasses[size]
  );

  return (
    <div className={cn("flex gap-2", className)}>
      <button
        onClick={onPrevious}
        className={buttonBaseClasses}
        aria-label="Previous"
      >
        <ChevronLeft size={iconSizes[size]} />
      </button>
      <button
        onClick={onNext}
        className={buttonBaseClasses}
        aria-label="Next"
      >
        <ChevronRight size={iconSizes[size]} />
      </button>
    </div>
  );
};

export interface StaggerNavigationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export const StaggerNavigationButton = React.forwardRef<HTMLButtonElement, StaggerNavigationButtonProps>(
  ({ direction, size = 'md', className, ...props }, ref) => {
    const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center justify-center transition-colors",
          "bg-background border-2 border-border",
          "hover:bg-primary hover:text-primary-foreground hover:border-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          sizeClasses[size],
          className
        )}
        aria-label={direction === 'left' ? 'Previous' : 'Next'}
        {...props}
      >
        <Icon size={iconSizes[size]} />
      </button>
    );
  }
);

StaggerNavigationButton.displayName = 'StaggerNavigationButton';
