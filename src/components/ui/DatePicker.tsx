import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from './DropdownMenu';
import { Calendar, CalendarProps } from './Calendar';
import { CalendarIcon } from 'lucide-react';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/cn';

export interface DatePickerProps extends CalendarProps {
	/** Format string for the display label in the trigger button */
	format?: string;
	/** Placeholder text when no value is selected */
	placeholder?: string;
	/** Additional class names for the trigger button */
	triggerClassName?: string;
}

/**
 * DatePicker Component
 *
 * A high-level component that combines a trigger button and a popover calendar.
 * Supports custom date/time formatting and standardizes the look across the app.
 *
 * @since 1.3.0
 */
export const DatePicker = ({
	value,
	onChange,
	format = 'yyyy-MM-dd',
	placeholder = 'Select date...',
	triggerClassName,
	...props
}: DatePickerProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className={cn(
						"flex items-center gap-1.5 px-3 py-1.5 h-9 bg-white border border-gray-200 rounded-md min-w-[180px] justify-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/10",
						triggerClassName
					)}
				>
					<CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
					<span className="text-sm font-medium text-gray-700">
						{value ? formatDate(value, format) : placeholder}
					</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="center"
				className="p-0 border-none shadow-none bg-transparent overflow-visible mt-2"
			>
				<Calendar
					value={value}
					onChange={onChange}
					{...props}
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
