import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const buttonVariants = cva(
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "bg-ui-status-info text-white hover:bg-ui-status-info/90",
                ghost: "bg-transparent text-ui-foreground-primary hover:bg-ui-background-tertiary",
                outline: "bg-transparent border border-ui-border-light text-ui-foreground-primary hover:bg-ui-background-tertiary",
                destructive: "bg-ui-status-error text-white hover:bg-ui-status-error/90",
                primary: "bg-ui-foreground-primary text-white hover:bg-ui-foreground-primary/90 shadow-sm",
            },
            size: {
                sm: "h-9 px-3 text-sm",
                md: "h-10 px-4 text-base",
                lg: "h-12 px-5 text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    },
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />}
                {!isLoading && leftIcon && <span className="mr-2" aria-hidden="true">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="ml-2" aria-hidden="true">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
