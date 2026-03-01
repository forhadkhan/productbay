import * as React from 'react';
import { cn } from '../../utils/cn';
import { __ } from '@wordpress/i18n';
import { Button, ButtonProps } from './Button';
import { CheckIcon, XIcon } from 'lucide-react';

export interface ConfirmButtonProps extends ButtonProps {
	/**
	 * Callback when the user confirms the action
	 */
	onConfirm: () => void;
	/**
	 * Optional callback when the user cancels the action
	 */
	onCancel?: () => void;
	/**
	 * The icon to display on the confirmation button (defaults to CheckIcon)
	 */
	confirmIcon?: React.ReactNode;
	/**
	 * The icon to display on the cancel button (defaults to XIcon)
	 */
	cancelIcon?: React.ReactNode;
	/**
	 * Optional message to show in the popover
	 */
	confirmMessage?: string;
	/**
	 * Position of the popover
	 * @default "top"
	 */
	popoverPosition?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * A feature-rich button that shows a confirmation popover before executing an action.
 * This is more user-friendly as it doesn't change the layout of the page.
 */
export const ConfirmButton = React.forwardRef<
	HTMLButtonElement,
	ConfirmButtonProps
>(
	(
		{
			className,
			variant = 'destructive',
			size = 'sm',
			onConfirm,
			onCancel,
			children,
			confirmIcon,
			cancelIcon,
			confirmMessage,
			popoverPosition = 'top',
			...props
		},
		ref
	) => {
		const [isConfirming, setIsConfirming] = React.useState(false);
		const containerRef = React.useRef<HTMLDivElement>(null);

		const handleInitialClick = (
			e: React.MouseEvent<HTMLButtonElement>
		) => {
			e.preventDefault();
			e.stopPropagation();
			setIsConfirming(true);
		};

		const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			e.stopPropagation();
			onConfirm();
			setIsConfirming(false);
		};

		const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (onCancel) onCancel();
			setIsConfirming(false);
		};

		// Close on outside click
		React.useEffect(() => {
			if (!isConfirming) return;

			const handleOutsideClick = (e: MouseEvent) => {
				if (
					containerRef.current &&
					!containerRef.current.contains(e.target as Node)
				) {
					setIsConfirming(false);
				}
			};

			document.addEventListener('mousedown', handleOutsideClick);
			return () =>
				document.removeEventListener('mousedown', handleOutsideClick);
		}, [isConfirming]);

		// Position classes for the popover
		const positionClasses = {
			top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
			bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
			left: 'right-full top-1/2 -translate-y-1/2 mr-2',
			right: 'left-full top-1/2 -translate-y-1/2 ml-2',
		};

		// Arrow position classes
		const arrowClasses = {
			top: 'top-full left-1/2 -translate-x-1/2 border-t-white border-x-transparent border-b-transparent',
			bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-white border-x-transparent border-t-transparent',
			left: 'left-full top-1/2 -translate-y-1/2 border-l-white border-y-transparent border-r-transparent',
			right: 'right-full top-1/2 -translate-y-1/2 border-r-white border-y-transparent border-l-transparent',
		};

		return (
			<div className="relative inline-block" ref={containerRef}>
				<Button
					ref={ref}
					variant={variant}
					size={size}
					className={cn('cursor-pointer', className)}
					onClick={handleInitialClick}
					{...props}
				>
					{children}
				</Button>

				{isConfirming && (
					<div
						className={cn(
							'absolute z-[100] flex flex-col items-center animate-in fade-in zoom-in-95 duration-200',
							positionClasses[popoverPosition]
						)}
					>
						<div className="bg-white border border-gray-200 rounded-lg shadow-xl p-1.5 flex items-center gap-1 min-w-max">
							{confirmMessage && (
								<span className="text-xs font-medium px-2 text-gray-700">
									{confirmMessage}
								</span>
							)}

							<div className="flex items-center border border-gray-200 rounded-md">
								<button
									type="button"
									onClick={handleConfirm}
									className={cn(
										'flex items-center justify-center p-1.5 bg-transparent transition-colors cursor-pointer',
										variant === 'destructive'
											? 'text-red-600 hover:bg-red-50'
											: 'text-green-600 hover:bg-green-50'
									)}
									title={__('Confirm', 'productbay')}
								>
									{confirmIcon || (
										<CheckIcon
											className="h-4 w-4 font-bold"
											strokeWidth={2.5}
										/>
									)}
								</button>

								<div className="w-px h-4 bg-gray-200 mx-0.5" />

								<button
									type="button"
									onClick={handleCancel}
									className="flex items-center justify-center p-1.5 bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
									title={__('Cancel', 'productbay')}
								>
									{cancelIcon || (
										<XIcon
											className="h-4 w-4 font-bold"
											strokeWidth={2.5}
										/>
									)}
								</button>
							</div>
						</div>

						{ /* Tooltip Arrow shadow-ish border part */}
						<div
							className={cn(
								'absolute w-0 h-0 border-[6px]',
								arrowClasses[popoverPosition].replace(
									/-white/g,
									'-gray-100'
								),
								popoverPosition === 'top'
									? 'mt-[1px]'
									: popoverPosition === 'bottom'
										? 'mb-[1px]'
										: popoverPosition === 'left'
											? 'ml-[1px]'
											: 'mr-[1px]'
							)}
						/>

						{ /* Tooltip Arrow white part */}
						<div
							className={cn(
								'absolute w-0 h-0 border-[5px]',
								arrowClasses[popoverPosition]
							)}
						/>
					</div>
				)}
			</div>
		);
	}
);

ConfirmButton.displayName = 'ConfirmButton';
