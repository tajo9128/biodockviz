import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    onClose?: () => void;
    showClose?: boolean;
}

const alertVariants = cva(
    "relative w-full rounded-lg border p-4",
    {
        variants: {
            variant: {
                default: "bg-white border-ui-border-light text-ui-foreground-primary",
                destructive: "bg-ui-status-error/10 border-ui-status-error/20 text-ui-status-error",
                success: "bg-ui-status-success/10 border-ui-status-success/20 text-ui-status-success",
                warning: "bg-ui-status-warning/10 border-ui-status-warning/20 text-ui-status-warning",
                info: "bg-ui-status-info/10 border-ui-status-info/20 text-ui-status-info",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, title, description, icon, onClose, showClose, ...props }, ref) => {
        const [open, setOpen] = React.useState(true);

        if (!open) return null;

        const handleClose = () => {
            if (onClose) onClose();
            setOpen(false);
        };

        const icons = {
            default: <Info className="h-5 w-5" />,
            destructive: <AlertCircle className="h-5 w-5" />,
            success: <CheckCircle className="h-5 w-5" />,
            warning: <AlertTriangle className="h-5 w-5" />,
            info: <Info className="h-5 w-5" />,
        };

        return (
            <div className={cn(alertVariants({ variant }), className)} ref={ref} role="alert" {...props}>
                <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">{icon || icons[variant || "default"]}</div>
                    <div className="flex-1">
                        {title && <h5 className="font-semibold text-sm mb-1">{title}</h5>}
                        {description && <p className="text-sm">{description}</p>}
                    </div>
                    {showClose && (
                        <button onClick={handleClose} className="ml-4" aria-label={t("common.close")}>
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

Alert.displayName = "Alert";

export { Alert, alertVariants };
