import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

/**
 * Variants for the toggle container (label) wrapper.
 * Handles the sizing and basic layout of the toggle.
 */
const toggleContainerVariants = cva(
    'relative inline-flex items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            size: {
                default: 'h-6',
                lg: 'h-7',
                sm: 'h-5',
                xs: 'h-4',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
);

/**
 * Variants for the toggle switch (the moving circle and background).
 * Handles the visual appearance of the switch in different states (checked, focused).
 */
const toggleSwitchVariants = cva(
    'bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all peer-checked:bg-blue-600',
    {
        variants: {
            size: {
                default: 'w-11 h-6 after:top-[2px] after:left-[2px] after:h-5 after:w-5',
                lg: 'w-14 h-7 after:top-[2px] after:left-[2px] after:h-6 after:w-6',
                sm: 'w-9 h-5 after:top-[2px] after:left-[2px] after:h-4 after:w-4',
                xs: 'w-7 h-4 after:top-[2px] after:left-[2px] after:h-3 after:w-3',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
);

/**
 * Props for the Toggle component.
 * Extends standard HTML input attributes (excluding 'size' to avoid conflict)
 * and includes variant props from class-variance-authority.
 */
export interface ToggleProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof toggleContainerVariants> {
    /**
     * Optional label text to display next to the toggle.
     */
    label?: string;
}

/**
 * A specialized checkbox component that looks like a toggle switch.
 * Supports different sizes and an optional label.
 */
const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
    ({ className, size, label, ...props }, ref) => {
        return (
            <label className={cn(toggleContainerVariants({ size }), className)}>
                <input
                    type="checkbox"
                    className="sr-only peer"
                    ref={ref}
                    {...props}
                />
                <div className={cn(toggleSwitchVariants({ size }))}></div>
                {label && (
                    <span className="ml-3 text-sm font-medium text-gray-900">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);
Toggle.displayName = 'Toggle';

export { Toggle, toggleContainerVariants };
