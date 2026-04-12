import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from 'lucide-react';
import { formatDate, parseDateString, todayStr } from '@/utils/date';
import { Button } from '@/components/ui/Button';
import { useState, useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { cn } from '@/utils/cn';

export interface CalendarProps {
	/** Current value in YYYY-MM-DD or YYYY-MM-DD HH:mm format */
	value?: string;
	/** Callback when a date or time is selected */
	onChange?: (value: string) => void;
	/** Array of YYYY-MM-DD dates to highlight with a dot (e.g. for logs) */
	highlightedDates?: string[];
	/** Selection mode */
	mode?: 'date' | 'datetime';
	/** Whether to show the 'Today' button */
	showToday?: boolean;
	/** Additional class names for the container */
	className?: string;
}

type ViewMode = 'days' | 'months' | 'years';

/**
 * Calendar Component
 *
 * A versatile calendar UI with support for days, months, years, and time selection.
 * Designed to be reusable across the entire plugin.
 *
 * @since 1.2.1
 */
export const Calendar = ({
	value,
	onChange,
	highlightedDates = [],
	mode = 'date',
	showToday = true,
	className,
}: CalendarProps) => {
	const current = useMemo(() => parseDateString(value || todayStr()), [value]);

	// View controls
	const [viewMode, setViewMode] = useState<ViewMode>('days');
	const [viewDate, setViewDate] = useState(() => new Date(current.year, current.month, 1));
	const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(current.year / 12) * 12);

	const viewYear = viewDate.getFullYear();
	const viewMonth = viewDate.getMonth();

	// Handlers
	const handleDateSelect = (d: number, m: number, y: number) => {
		const newDate = new Date(y, m, d, current.hours, current.minutes);
		const format = mode === 'datetime' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';
		onChange?.(formatDate(newDate, format));

		if (m !== viewMonth || y !== viewYear) {
			setViewDate(new Date(y, m, 1));
		}
	};

	const handleTimeChange = (type: 'hours' | 'minutes', val: number) => {
		const newDate = new Date(current.year, current.month, current.day,
			type === 'hours' ? val : current.hours,
			type === 'minutes' ? val : current.minutes
		);
		const format = mode === 'datetime' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';
		onChange?.(formatDate(newDate, format));
	};

	const navigate = (direction: number) => {
		if (viewMode === 'days') {
			setViewDate(new Date(viewYear, viewMonth + direction, 1));
		} else if (viewMode === 'months') {
			setViewDate(new Date(viewYear + direction, viewMonth, 1));
		} else if (viewMode === 'years') {
			setYearRangeStart((prev) => prev + direction * 12);
		}
	};

	// Rendering logic for Days
	const days = useMemo(() => {
		const result = [];
		const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
		const firstDay = new Date(viewYear, viewMonth, 1).getDay();
		const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();

		for (let i = firstDay - 1; i >= 0; i--) {
			result.push({ day: prevMonthLastDay - i, month: viewMonth - 1, year: viewYear, current: false });
		}
		for (let i = 1; i <= daysInMonth; i++) {
			result.push({ day: i, month: viewMonth, year: viewYear, current: true });
		}
		const remaining = 42 - result.length;
		for (let i = 1; i <= remaining; i++) {
			result.push({ day: i, month: viewMonth + 1, year: viewYear, current: false });
		}
		return result;
	}, [viewYear, viewMonth]);

	const monthNamesShort = [
		__('Jan', 'productbay'), __('Feb', 'productbay'), __('Mar', 'productbay'), __('Apr', 'productbay'),
		__('May', 'productbay'), __('Jun', 'productbay'), __('Jul', 'productbay'), __('Aug', 'productbay'),
		__('Sep', 'productbay'), __('Oct', 'productbay'), __('Nov', 'productbay'), __('Dec', 'productbay')
	];

	return (
		<div className={cn("w-[280px] bg-white rounded-lg shadow-2xl p-4 border border-gray-100", className)} onClick={(e) => e.stopPropagation()}>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-1">
					{viewMode === 'days' && (
						<button
							type="button"
							onClick={() => setViewMode('months')}
							className="text-sm font-bold text-gray-900 m-0 bg-transparent border-0 cursor-pointer hover:text-blue-600 hover:bg-gray-50 px-1.5 py-0.5 rounded transition-colors"
						>
							{formatDate(viewDate, 'MMMM')}
						</button>
					)}
					{(viewMode === 'days' || viewMode === 'months') && (
						<button
							type="button"
							onClick={() => setViewMode('years')}
							className="text-sm font-bold text-gray-900 m-0 bg-transparent border-0 cursor-pointer hover:text-blue-600 hover:bg-gray-50 px-1.5 py-0.5 rounded transition-colors"
						>
							{formatDate(viewDate, 'yyyy')}
						</button>
					)}
					{viewMode === 'years' && (
						<span className="text-sm font-bold text-gray-900 px-1.5">
							{yearRangeStart} - {yearRangeStart + 11}
						</span>
					)}
				</div>
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-7 w-7 p-0 cursor-pointer">
						<ChevronLeftIcon className="w-4 h-4 text-gray-500" />
					</Button>
					<Button variant="ghost" size="icon" onClick={() => navigate(1)} className="h-7 w-7 p-0 cursor-pointer">
						<ChevronRightIcon className="w-4 h-4 text-gray-500" />
					</Button>
				</div>
			</div>

			{/* Views */}
			{viewMode === 'days' && (
				<>
					<div className="grid grid-cols-7 mb-2">
						{[__('Su', 'productbay'), __('Mo', 'productbay'), __('Tu', 'productbay'), __('We', 'productbay'), __('Th', 'productbay'), __('Fr', 'productbay'), __('Sa', 'productbay')].map(d => (
							<div key={d} className="text-[10px] font-bold text-gray-400 text-center uppercase">{d}</div>
						))}
					</div>
					<div className="grid grid-cols-7 gap-px bg-gray-50 rounded-md overflow-hidden border border-gray-50">
						{days.map((d, i) => {
							const dateStr = formatDate(new Date(d.year, d.month, d.day), 'yyyy-MM-dd');
							const isSelected = value?.startsWith(dateStr);
							const hasLogs = highlightedDates.includes(dateStr);
							const isToday = formatDate(new Date(), 'yyyy-MM-dd') === dateStr;

							return (
								<button
									key={i}
									type="button"
									onClick={() => handleDateSelect(d.day, d.month, d.year)}
									className={cn(
										"relative h-9 w-full flex items-center justify-center text-xs transition-all border-0 bg-white cursor-pointer group",
										!d.current && "text-gray-300",
										d.current && !isSelected && "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
										isSelected && "bg-blue-600 text-white font-bold z-10 shadow-sm"
									)}
								>
									{d.day}
									{!isSelected && hasLogs && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-400" />}
									{isToday && !isSelected && <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-emerald-500" />}
								</button>
							);
						})}
					</div>
				</>
			)}

			{viewMode === 'months' && (
				<div className="grid grid-cols-3 gap-2">
					{monthNamesShort.map((m, i) => (
						<button
							key={m}
							type="button"
							onClick={() => { setViewDate(new Date(viewYear, i, 1)); setViewMode('days'); }}
							className={cn(
								"h-10 text-xs rounded-md border-0 cursor-pointer transition-colors",
								viewMonth === i ? "bg-blue-600 text-white font-bold" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
							)}
						>
							{m}
						</button>
					))}
				</div>
			)}

			{viewMode === 'years' && (
				<div className="grid grid-cols-3 gap-2">
					{Array.from({ length: 12 }).map((_, i) => {
						const y = yearRangeStart + i;
						return (
							<button
								key={y}
								type="button"
								onClick={() => { setViewDate(new Date(y, viewMonth, 1)); setViewMode('months'); }}
								className={cn(
									"h-10 text-xs rounded-md border-0 cursor-pointer transition-colors",
									viewYear === y ? "bg-blue-600 text-white font-bold" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
								)}
							>
								{y}
							</button>
						);
					})}
				</div>
			)}

			{/* Time Selection */}
			{mode === 'datetime' && (
				<div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
					<div className="flex items-center gap-2 text-gray-400">
						<ClockIcon className="w-3.5 h-3.5" />
						<span className="text-[11px] font-bold uppercase tracking-wider">{__('Time', 'productbay')}</span>
					</div>
					<div className="flex items-center gap-1">
						<select
							value={current.hours}
							onChange={(e) => handleTimeChange('hours', parseInt(e.target.value))}
							className="h-8 w-14 text-xs border border-gray-200 rounded-md bg-white cursor-pointer outline-none focus:border-blue-400"
						>
							{Array.from({ length: 24 }).map((_, i) => (
								<option key={i} value={i}>{String(i).padStart(2, '0')}</option>
							))}
						</select>
						<span className="text-gray-400 font-bold">:</span>
						<select
							value={current.minutes}
							onChange={(e) => handleTimeChange('minutes', parseInt(e.target.value))}
							className="h-8 w-14 text-xs border border-gray-200 rounded-md bg-white cursor-pointer outline-none focus:border-blue-400"
						>
							{Array.from({ length: 60 }).map((_, i) => (
								<option key={i} value={i}>{String(i).padStart(2, '0')}</option>
							))}
						</select>
					</div>
				</div>
			)}

			{/* Footer / Legend */}
			<div className="mt-4 border-t border-gray-50 pt-3">
				{showToday && (
					<div className="flex justify-center mb-3">
						<button
							type="button"
							onClick={() => {
								const now = new Date();
								const format = mode === 'datetime' ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';
								onChange?.(formatDate(now, format));
								setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
								setViewMode('days');
							}}
							className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors cursor-pointer border-0"
						>
							{__('Jump to Today', 'productbay')}
						</button>
					</div>
				)}

				<div className="flex items-center justify-between text-[10px] text-gray-400">
					<div className="flex items-center gap-1.5">
						<span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
						<span>{__('Has logs', 'productbay')}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
						<span className="text-gray-600 font-medium">{__('Selected', 'productbay')}</span>
					</div>
				</div>
			</div>
		</div>
	);
};
