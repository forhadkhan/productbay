import * as React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
	/** The display text for the option */
	label: string;
	/** The internal value for the option */
	value: string;
}

export interface SelectProps {
	/** The currently selected value */
	value?: string;
	/** Callback when the selected value changes */
	onChange: (value: string) => void;
	/** List of options to display */
	options: SelectOption[];
	/** Placeholder text when no value is selected. Defaults to "Select..." */
	placeholder?: string;
	/** Optional title/label at the top of the dropdown list */
	label?: string;
	/** Additional CSS classes for the container */
	className?: string;
	/** Whether the select is disabled */
	disabled?: boolean;
	/** Optional icon to display on the left of the trigger button */
	icon?: React.ReactNode;
	/** Whether to allow deselecting the selected option by clicking the label */
	allowDeselect?: boolean;
}

/**
 * Custom Select component mimicking Shadcn UI.
 * Features:
 * - Custom styling with sleek blue border on focus/active
 * - Checkmark for selected option
 * - Optional label at the top of the list
 * - Click outside to close
 * - Optional icon support
 * - Click label/title to deselect (if allowed)
 */
const Select = React.forwardRef<HTMLDivElement, SelectProps>(
	(
		{
			className,
			options,
			value,
			onChange,
			placeholder = 'Select...',
			label,
			disabled,
			icon,
			allowDeselect = false,
		},
		ref
	) => {
		const [isOpen, setIsOpen] = React.useState(false);
		const containerRef = React.useRef<HTMLDivElement>(null);

		const selectedOption = options.find((opt) => opt.value === value);

		// Handle click outside
		React.useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					containerRef.current &&
					!containerRef.current.contains(event.target as Node)
				) {
					setIsOpen(false);
				}
			};
			document.addEventListener('mousedown', handleClickOutside);
			return () =>
				document.removeEventListener('mousedown', handleClickOutside);
		}, []);

		const handleSelect = (optionValue: string) => {
			onChange(optionValue);
			setIsOpen(false);
		};

		return (
			<div
				className={cn('relative w-full', className)}
				ref={containerRef}
			>
				<button
					type="button"
					onClick={() => !disabled && setIsOpen(!isOpen)}
					className={cn(
						'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
						isOpen &&
						'ring-1 ring-blue-500 border-blue-500',
						className
					)}
					disabled={disabled}
				>
					<div className="flex items-center gap-2 truncate">
						{icon && (
							<span className="flex items-center justify-center text-gray-500 shrink-0">
								{icon}
							</span>
						)}
						<span
							className={cn(
								'block truncate',
								!selectedOption && 'text-gray-500'
							)}
						>
							{selectedOption
								? selectedOption.label
								: label || placeholder}
						</span>
					</div>
					<ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
				</button>

				{isOpen && (
					<div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-80 slide-in-from-top-1">
						{label && (
							<div
								onClick={() => {
									if (allowDeselect && value) {
										handleSelect('');
									}
								}}
								className={cn(
									'px-2 py-1.5 text-xs font-semibold text-gray-500 border-b border-gray-100 bg-gray-50/50',
									allowDeselect &&
									value &&
									'cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors'
								)}
								title={
									allowDeselect
										? 'Click to clear selection'
										: undefined
								}
							>
								{label}
							</div>
						)}
						<div className="p-1">
							{options.map((option) => (
								<div
									key={option.value}
									onClick={() =>
										handleSelect(option.value)
									}
									className={cn(
										'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors',
										option.value === value &&
										'bg-gray-50 font-medium'
									)}
								>
									<span className="block truncate">
										{option.label}
									</span>
									{option.value === value && (
										<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
											<Check className="h-4 w-4 text-blue-600" />
										</span>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	}
);
Select.displayName = 'Select';

export { Select };
