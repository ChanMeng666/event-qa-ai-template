import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-md bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "rounded-md hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        stagger:
          "border-2 border-border bg-background text-foreground shadow-stagger hover:bg-primary hover:text-primary-foreground hover:border-primary",
        staggerPrimary:
          "border-2 border-primary bg-background text-foreground shadow-stagger-primary hover:bg-primary hover:text-primary-foreground",
        staggerSm:
          "border-2 border-border bg-background text-foreground shadow-stagger-sm hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-stagger-sm-primary",
        staggerSmPrimary:
          "border-2 border-primary bg-background text-foreground shadow-stagger-sm-primary hover:bg-primary hover:text-primary-foreground",
        // Sci-Fi variants
        scifi:
          "relative border border-white/30 bg-transparent text-white font-display font-bold tracking-[2px] uppercase overflow-hidden hover:border-white hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] [&>span]:relative [&>span]:z-10 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-full",
        scifiPrimary:
          "relative border border-white/30 bg-white/5 text-white font-display font-bold tracking-[2px] uppercase overflow-hidden shadow-glow-sm hover:border-white hover:bg-white/10 hover:shadow-glow [&>span]:relative [&>span]:z-10 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-full",
        scifiGlass:
          "relative border border-white/20 bg-white/5 backdrop-blur-[20px] text-white font-display font-bold tracking-[2px] uppercase overflow-hidden hover:border-white/40 hover:bg-white/10 [&>span]:relative [&>span]:z-10",
        scifiOutline:
          "relative border border-white/20 bg-transparent text-white/70 font-display font-normal tracking-[2px] uppercase transition-all duration-300 ease-scifi-smooth hover:border-white hover:text-white hover:tracking-[3px] hover:[text-shadow:0_0_10px_rgba(255,255,255,0.5)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
        square: "h-14 w-14",
        squareSm: "h-10 w-10",
        squareLg: "h-16 w-16",
        // Sci-Fi sizes
        scifi: "h-12 px-10 py-4 text-xs",
        scifiLg: "h-14 px-12 py-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
