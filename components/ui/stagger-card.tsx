"use client"

import React from 'react';
import { cn } from '@/lib/utils';

const clipSizeClasses = {
  sm: 'clip-corner-sm',
  md: 'clip-corner-md',
  lg: 'clip-corner-lg',
} as const;

const shadowClasses = {
  default: 'shadow-stagger',
  primary: 'shadow-stagger-primary',
  none: '',
} as const;

export interface StaggerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  clipSize?: keyof typeof clipSizeClasses;
  shadowVariant?: keyof typeof shadowClasses;
  isActive?: boolean;
  children: React.ReactNode;
}

export const StaggerCard = React.forwardRef<HTMLDivElement, StaggerCardProps>(
  ({
    className,
    clipSize = 'sm',
    shadowVariant = 'default',
    isActive = false,
    children,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative border-2 p-6 transition-all duration-300",
          clipSizeClasses[clipSize],
          isActive
            ? "bg-primary text-primary-foreground border-primary shadow-stagger-primary"
            : cn(
                "bg-card text-card-foreground border-border",
                shadowClasses[shadowVariant],
                "hover:border-primary/50"
              ),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StaggerCard.displayName = 'StaggerCard';

export interface StaggerCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const StaggerCardHeader = React.forwardRef<HTMLDivElement, StaggerCardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mb-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StaggerCardHeader.displayName = 'StaggerCardHeader';

export interface StaggerCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const StaggerCardContent = React.forwardRef<HTMLDivElement, StaggerCardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StaggerCardContent.displayName = 'StaggerCardContent';

export interface StaggerCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const StaggerCardFooter = React.forwardRef<HTMLDivElement, StaggerCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-4 pt-4 border-t border-border", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StaggerCardFooter.displayName = 'StaggerCardFooter';
