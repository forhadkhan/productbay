import * as React from 'react';
import { cn } from '../../utils/cn';

export interface TooltipProps {
	/**
	 * The content to show in the tooltip
	 */
	content: React.ReactNode;
	/**
	 * The trigger element
	 */
	children: React.ReactNode;
	/**
	 * Position of the tooltip
	 * @default "top"
	 */
	position?: 'top' | 'bottom' | 'left' | 'right';
	/**
	 * Additional classes for the tooltip content
	 */
	className?: string;
	/**
	 * Delay before showing the tooltip (in ms)
	 * @default 0
	 */
	delay?: number;
	/**
	 * Delay before hiding the tooltip (in ms) to allow interaction
	 * @default 150
	 */
	hideDelay?: number;
}

/**
 * A reusable Tooltip component with support for text selection and interaction.
 */
export const Tooltip: React.FC<TooltipProps> = ({
	content,
	children,
	position = 'top',
	className,
	delay = 0,
	hideDelay = 150,
}) => {
	const [isVisible, setIsVisible] = React.useState(false);
	const showTimeoutRef = React.useRef<number | null>(null);
	const hideTimeoutRef = React.useRef<number | null>(null);

	const clearTimeouts = () => {
		if (showTimeoutRef.current) {
			clearTimeout(showTimeoutRef.current);
			showTimeoutRef.current = null;
		}
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current);
			hideTimeoutRef.current = null;
		}
	};

	const showTooltip = () => {
		clearTimeouts();
		if (!isVisible) {
			showTimeoutRef.current = window.setTimeout(
				() => setIsVisible(true),
				delay
			);
		}
	};

	const hideTooltip = () => {
		clearTimeouts();
		if (isVisible) {
			hideTimeoutRef.current = window.setTimeout(
				() => setIsVisible(false),
				hideDelay
			);
		}
	};

	// Cleanup on unmount
	React.useEffect(() => {
		return () => clearTimeouts();
	}, []);

	// Position classes
	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2',
	};

	// Arrow positioning classes for the rotated square
	const arrowPositions = {
		top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
		bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
		left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
		right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2',
	};

	return (
		<div
			className="relative inline-block z-30"
			onMouseEnter={showTooltip}
			onMouseLeave={hideTooltip}
			onFocus={showTooltip}
			onBlur={hideTooltip}
		>
			{children}
			{isVisible && (
				<div
					className={cn(
						'absolute z-[110] px-3 py-1.5 text-xs font-normal text-white bg-gray-800 rounded shadow-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 select-text cursor-auto',
						positionClasses[position],
						className
					)}
					role="tooltip"
					onMouseEnter={showTooltip} // Keep open when hovering the tooltip itself
					onMouseLeave={hideTooltip}
				>
					<span className="relative z-10">{content}</span>
					{ /* Arrow: Rotated square that inherits parent background */}
					<div
						className={cn(
							'absolute w-2 h-2 bg-inherit transform rotate-45',
							arrowPositions[position]
						)}
					/>
				</div>
			)}
		</div>
	);
};
