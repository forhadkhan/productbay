import * as React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps
	extends React.InputHTMLAttributes< HTMLInputElement > {
	/**
	 * Error state for the input.
	 * Can be a boolean to indicate error status, or a string containing the error message.
	 * If truthy, applies error styling and sets aria-invalid.
	 */
	error?: boolean | string;
}

/**
 * Input component that renders a styled HTML input element.
 * Supports standard HTML input attributes and a custom error state.
 */
const Input = React.forwardRef< HTMLInputElement, InputProps >(
	( { className, type, error, ...props }, ref ) => {
		return (
			<input
				type={ type }
				className={ cn(
					'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
					error && 'border-red-500 focus:border-red-500',
					className
				) }
				ref={ ref }
				aria-invalid={ !! error }
				{ ...props }
			/>
		);
	}
);
Input.displayName = 'Input';

export { Input };
