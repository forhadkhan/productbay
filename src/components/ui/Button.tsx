import * as React from 'react';
import { cn } from '../../utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Button variant styles using class-variance-authority (CVA).
 *
 * Provides a flexible styling system for buttons with support for:
 * - variants: default, destructive, outline, secondary, ghost, link, success
 * - sizes: default, sm, xs, lg, icon
 */

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 transition-transform duration-100',
	{
		variants: {
			variant: {
				default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
				destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
				outline:
					'border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900',
				secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200/80',
				ghost: 'hover:bg-gray-100 hover:text-gray-900',
				link: 'text-blue-600 underline-offset-4 hover:underline',
				success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				xs: 'h-7 rounded px-2 text-xs',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

/**
 * Props for the Button component.
 * Extends standard HTML button attributes and adds variant props from CVA.
 */
export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
	VariantProps<typeof buttonVariants> {
	/**
	 * If true, the button will render as its child component while maintaining styles.
	 * Useful for using the button styling on a Link or other component.
	 */
	asChild?: boolean;
}

/**
 * Reusable Button component with multiple variants and sizes.
 * Built with Tailwind CSS and class-variance-authority for consistent styling.
 *
 * @example
 * <Button variant="default" size="sm" onClick={handleClick}>
 *   Click Me
 * </Button>
 */

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		return (
			<button
				className={cn(
					buttonVariants({ variant, size, className })
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
