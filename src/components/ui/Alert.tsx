import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

/**
 * Alert variant styles using class-variance-authority (CVA).
 * 
 * Provides consistent styling for alert components with support for:
 * - default: Neutral informational alerts
 * - destructive: Error/warning alerts (red styling)
 * - warning: Caution alerts (amber styling)
 * - success: Confirmation alerts (green styling)
 */
const alertVariants = cva(
    "relative w-full rounded-lg border px-4 py-3 text-sm flex items-start gap-3",
    {
        variants: {
            variant: {
                default: "bg-gray-50 border-gray-200 text-gray-800",
                destructive: "bg-red-50 border-red-200 text-red-800",
                warning: "bg-amber-50 border-amber-200 text-amber-800",
                success: "bg-green-50 border-green-200 text-green-800",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

/**
 * Alert component for displaying contextual feedback messages.
 * 
 * @example
 * // Destructive alert with icon
 * <Alert variant="destructive">
 *     <AlertCircleIcon className="w-4 h-4" />
 *     <AlertDescription>Please select at least one category.</AlertDescription>
 * </Alert>
 * 
 * @example
 * // Success alert with title and description
 * <Alert variant="success">
 *     <CheckCircleIcon className="w-4 h-4" />
 *     <div>
 *         <AlertTitle>Success!</AlertTitle>
 *         <AlertDescription>Your changes have been saved.</AlertDescription>
 *     </div>
 * </Alert>
 */
function Alert({
    className,
    variant,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    )
}

/**
 * AlertTitle component for the alert heading.
 * Should be used as a direct child of Alert.
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cn("font-medium leading-tight", className)}
            {...props}
        />
    )
}

/**
 * AlertDescription component for the alert body text.
 * Should be used as a direct child of Alert.
 */
function AlertDescription({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn("text-sm [&_p]:leading-relaxed", className)}
            {...props}
        />
    )
}

export { Alert, AlertTitle, AlertDescription }
