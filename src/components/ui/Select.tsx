import * as React from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
	label: string;
	value: string;
}

export interface SelectProps {
	value?: string;
	onChange: ( value: string ) => void;
	options: SelectOption[];
	placeholder?: string;
	label?: string; // Optional title/label at the top of the dropdown
	className?: string;
	disabled?: boolean;
}

/**
 * Custom Select component mimicking Shadcn UI.
 * Features:
 * - Custom styling
 * - Checkmark for selected option
 * - Optional label at the top of the list
 * - Click outside to close
 */
const Select = React.forwardRef< HTMLDivElement, SelectProps >(
	(
		{
			className,
			options,
			value,
			onChange,
			placeholder = 'Select...',
			label,
			disabled,
		},
		ref
	) => {
		const [ isOpen, setIsOpen ] = React.useState( false );
		const containerRef = React.useRef< HTMLDivElement >( null );

		const selectedOption = options.find( ( opt ) => opt.value === value );

		// Handle click outside
		React.useEffect( () => {
			const handleClickOutside = ( event: MouseEvent ) => {
				if (
					containerRef.current &&
					! containerRef.current.contains( event.target as Node )
				) {
					setIsOpen( false );
				}
			};
			document.addEventListener( 'mousedown', handleClickOutside );
			return () =>
				document.removeEventListener( 'mousedown', handleClickOutside );
		}, [] );

		const handleSelect = ( optionValue: string ) => {
			onChange( optionValue );
			setIsOpen( false );
		};

		return (
			<div
				className={ cn( 'relative w-full', className ) }
				ref={ containerRef }
			>
				<button
					type="button"
					onClick={ () => ! disabled && setIsOpen( ! isOpen ) }
					className={ cn(
						'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
						isOpen &&
							'ring-2 ring-slate-950 ring-offset-2 border-transparent',
						className
					) }
					disabled={ disabled }
				>
					<span
						className={ cn(
							'block truncate',
							! selectedOption && 'text-gray-500'
						) }
					>
						{ selectedOption ? selectedOption.label : placeholder }
					</span>
					<ChevronDown className="h-4 w-4 opacity-50" />
				</button>

				{ isOpen && (
					<div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-80 slide-in-from-top-1">
						{ label && (
							<div className="px-2 py-1.5 text-xs font-semibold text-gray-500 border-b border-gray-100 bg-gray-50/50">
								{ label }
							</div>
						) }
						<div className="p-1">
							{ options.map( ( option ) => (
								<div
									key={ option.value }
									onClick={ () =>
										handleSelect( option.value )
									}
									className={ cn(
										'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
										option.value === value &&
											'bg-gray-50 font-medium'
									) }
								>
									<span className="block truncate">
										{ option.label }
									</span>
									{ option.value === value && (
										<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
											<Check className="h-4 w-4 text-slate-900" />
										</span>
									) }
								</div>
							) ) }
						</div>
					</div>
				) }
			</div>
		);
	}
);
Select.displayName = 'Select';

export { Select };
