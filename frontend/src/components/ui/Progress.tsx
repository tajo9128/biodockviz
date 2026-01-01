import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    label?: string;
    size?: "sm" | "md" | "lg";
    showPercentage?: boolean;
    ariaLabel?: string;
}

const progressVariants = cva("w-full overflow-hidden rounded-lg bg-ui-background-secondary", {
    variants: {
        size: {
            sm: "h-1.5",
            md: "h-2",
            lg: "h-4",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value, max = 100, label, size, showPercentage = true, ariaLabel, ...props }, ref) => {
        const percentage = Math.round((value / max) * 100);
        const safePercentage = Math.min(Math.max(percentage, 0), 100);

        return (
            <div className="w-full" {...props}>
                {label && (
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-ui-foreground-secondary">{label}</span>
                        {showPercentage && (
                            <span className="text-sm font-medium text-ui-foreground-primary">{safePercentage}%</span>
                        )}
                    </div>
                )}
                <div className={cn(progressVariants({ size }), className)} ref={ref}>
                    <div
                        className="h-full bg-ui-foreground-primary rounded-full transition-all duration-300"
                        style={{ width: `${safePercentage}%` }}
                        role="progressbar"
                        aria-valuenow={value}
                        aria-valuemin={0}
                        aria-valuemax={max}
                        aria-label={ariaLabel || label}
                    />
                </div>
            </div>
        );
    }
);

Progress.displayName = "Progress";

export { Progress, progressVariants };
