/**
 * LogViewer Component
 *
 * Displays activity log entries in the Settings page Log tab.
 * Features: level filtering, search, date navigation, expandable details,
 * and clear-all functionality.
 *
 * @since 1.2.1
 */
import { useState, useEffect, useCallback, memo } from 'react';
import {
	RefreshCwIcon,
	ScrollTextIcon,
	CopyIcon,
	CheckIcon,
	DownloadIcon,
	ZapIcon,
	TerminalIcon,
	NetworkIcon,
	InfoIcon,
	CheckCircleIcon,
	AlertTriangleIcon,
	XCircleIcon,
	TrashIcon,
	ChevronLeftIcon,
	CalendarIcon,
	ChevronRightIcon,
	SearchIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	SettingsIcon,
	HistoryIcon,
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { __ } from '@wordpress/i18n';
import { apiFetch } from '@/utils/api';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface LogEntry {
	level: 'info' | 'success' | 'warning' | 'error';
	title: string;
	details: string;
	time: string;
	user: string;
	context?: {
		ip: string;
		url: string;
		method: string;
		ua: string;
	};
	backtrace?: Array<{ file: string; line: number; function: string }>;
	env?: {
		php: string;
		wp: string;
		productbay: string;
	};
}

interface LogResponse {
	entries: LogEntry[];
	total: number;
	page: number;
	per_page: number;
	available_dates: string[];
	users: string[];
}

/* -------------------------------------------------------------------------- */
/*  Level config                                                               */
/* -------------------------------------------------------------------------- */

const LEVEL_CONFIG = {
	info: {
		label: 'Info',
		icon: InfoIcon,
		bg: 'bg-blue-50',
		text: 'text-blue-700',
		badge: 'bg-blue-100 text-blue-700',
		border: 'border-blue-200',
	},
	success: {
		label: 'Success',
		icon: CheckCircleIcon,
		bg: 'bg-emerald-50',
		text: 'text-emerald-700',
		badge: 'bg-emerald-100 text-emerald-700',
		border: 'border-emerald-200',
	},
	warning: {
		label: 'Warning',
		icon: AlertTriangleIcon,
		bg: 'bg-amber-50',
		text: 'text-amber-700',
		badge: 'bg-amber-100 text-amber-700',
		border: 'border-amber-200',
	},
	error: {
		label: 'Error',
		icon: XCircleIcon,
		bg: 'bg-red-50',
		text: 'text-red-700',
		badge: 'bg-red-100 text-red-700',
		border: 'border-red-200',
	},
} as const;

const LEVEL_OPTIONS = ['', 'info', 'success', 'warning', 'error'] as const;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatTime = (iso: string): string => {
	try {
		const d = new Date(iso);
		return d.toLocaleTimeString(undefined, {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	} catch {
		return iso;
	}
};

const formatDateLabel = (dateStr: string): string => {
	try {
		const d = new Date(dateStr + 'T00:00:00');
		return d.toLocaleDateString(undefined, {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	} catch {
		return dateStr;
	}
};

const todayStr = (): string => {
	const now = new Date();
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const d = String(now.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
};

/* -------------------------------------------------------------------------- */
/*  LogRow                                                                     */
/* -------------------------------------------------------------------------- */

const LogRow = memo(({ entry }: { entry: LogEntry }) => {
	const [expanded, setExpanded] = useState(false);
	const [copied, setCopied] = useState(false);
	const config = LEVEL_CONFIG[entry.level] || LEVEL_CONFIG.info;
	const Icon = config.icon;

	return (
		<div
			className={`border-l-4 ${config.border} bg-white rounded-md shadow-sm transition-all duration-150`}
		>
			<button
				type="button"
				onClick={() => entry.details && setExpanded((prev) => !prev)}
				className={`w-full flex items-center gap-3 px-4 py-3 text-left bg-transparent border-0 ${entry.details ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
					}`}
			>
				{/* Level icon */}
				<Icon className={`w-4 h-4 flex-shrink-0 ${config.text}`} />

				{/* Level badge */}
				<span
					className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.badge} flex-shrink-0`}
				>
					{config.label}
				</span>

				{/* Title */}
				<span className="flex-1 text-sm font-medium text-gray-800 truncate">
					{entry.title}
				</span>

				{/* User */}
				<span className="text-xs text-gray-400 flex-shrink-0 hidden sm:inline">
					{entry.user}
				</span>

				{/* Time */}
				<span className="text-xs text-gray-400 flex-shrink-0 tabular-nums">
					{formatTime(entry.time)}
				</span>

				{/* Expand chevron */}
				{entry.details && (
					<span className="flex-shrink-0 text-gray-400">
						{expanded ? (
							<ChevronUpIcon className="w-4 h-4" />
						) : (
							<ChevronDownIcon className="w-4 h-4" />
						)}
					</span>
				)}
			</button>

			{/* Expanded details */}
			{expanded && entry.details && (
				<div className="px-4 pb-3 ml-7 overflow-hidden space-y-3">
					{/* Diagnostic Meta */}
					{entry.context && (
						<div className="flex flex-wrap gap-4 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-400 font-mono">
							<div className="flex items-center gap-1.5" title="IP Address">
								<NetworkIcon className="w-3 h-3" />
								{entry.context.ip}
							</div>
							<div className="flex items-center gap-1.5" title="HTTP Method">
								<TerminalIcon className="w-3 h-3" />
								{entry.context.method}
							</div>
							<div className="flex items-center gap-1.5 truncate max-w-full" title="Request URL">
								<span className="font-bold">URL:</span> {entry.context.url}
							</div>
						</div>
					)}

					<div className="relative group">
						<p className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2 m-0 whitespace-pre-wrap font-mono break-all border border-gray-200">
							{entry.details}
						</p>
						<Button
							type="button"
							size="icon"
							variant="secondary"
							onClick={(e) => {
								e.stopPropagation();
								const textToCopy = [
									`[${entry.level.toUpperCase()}] ${entry.title}`,
									`Time: ${entry.time}`,
									`User: ${entry.user}`,
									entry.context ? `Context: ${JSON.stringify(entry.context, null, 2)}` : '',
									`\nDetails:\n${entry.details}`,
								].filter(Boolean).join('\n');
								navigator.clipboard.writeText(textToCopy);
								setCopied(true);
								setTimeout(() => setCopied(false), 2000);
							}}
							title={__('Copy details', 'productbay')}
							className="border border-gray-200 cursor-pointer mt-2"
						>
							{copied ? (
								<CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
							) : (
								<CopyIcon className="w-3.5 h-3.5" />
							)}
						</Button>
					</div>

					{/* Expanded Diagnostics for Errors */}
					{entry.backtrace && (
						<div className="space-y-2">
							<h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider m-0">
								{__('Stack Trace', 'productbay')}
							</h4>
							<div className="bg-gray-900 rounded-md text-[11px] p-3 font-mono text-gray-300 space-y-1">
								{entry.backtrace.map((frame, idx) => (
									<div key={idx} className="truncate">
										<span className="text-blue-400">#{idx}</span> {frame.file}:{frame.line} → <span className="text-yellow-400">{frame.function}()</span>
									</div>
								))}
							</div>
						</div>
					)}

					{entry.env && (
						<div className="flex gap-4 text-[10px] text-gray-400 italic">
							<span>PHP {entry.env.php}</span>
							<span>WP {entry.env.wp}</span>
							<span>Plugin {entry.env.productbay}</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
});

LogRow.displayName = 'LogRow';

/* -------------------------------------------------------------------------- */
/*  LogViewer                                                                  */
/* -------------------------------------------------------------------------- */

const LogViewer = memo(() => {
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const [total, setTotal] = useState(0);
	const [availableDates, setAvailableDates] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [clearing, setClearing] = useState(false);
	const [showClearModal, setShowClearModal] = useState(false);

	const { settings, updateSettings } = useSettingsStore();

	// Filters
	const [date, setDate] = useState(() => (window as any).productBaySettings?.today || todayStr());
	const [level, setLevel] = useState('');
	const [user, setUser] = useState('');
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [page, setPage] = useState(1);
	const [uniqueUsers, setUniqueUsers] = useState<string[]>([]);
	const [autoRefresh, setAutoRefresh] = useState(() => {
		return localStorage.getItem('pb_log_live_mode') === 'true';
	});
	const perPage = 15;
	const [loadingMore, setLoadingMore] = useState(false);
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [showExportDropdown, setShowExportDropdown] = useState(false);
	const [savingSettings, setSavingSettings] = useState(false);

	// Persist autoRefresh
	useEffect(() => {
		localStorage.setItem('pb_log_live_mode', autoRefresh.toString());
	}, [autoRefresh]);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(search), 300);
		return () => clearTimeout(timer);
	}, [search]);

	// Reset page and logs when filters change
	useEffect(() => {
		setLogs([]);
		setPage(1);
	}, [date, level, user, debouncedSearch]);

	// Fetch logs
	const fetchLogs = useCallback(async (isLoadMore = false) => {
		if (isLoadMore) {
			setLoadingMore(true);
		} else {
			setLoading(true);
		}

		try {
			const params = new URLSearchParams({
				date,
				page: String(page),
				per_page: String(perPage),
			});
			if (level) params.set('level', level);
			if (user) params.set('user', user);
			if (debouncedSearch) params.set('search', debouncedSearch);

			const data = await apiFetch<LogResponse>(`logs?${params.toString()}`);

			if (isLoadMore) {
				setLogs((prev) => [...prev, ...(data.entries || [])]);
			} else {
				setLogs(data.entries || []);
			}

			setTotal(data.total || 0);
			setAvailableDates(data.available_dates || []);
			setUniqueUsers(data.users || []);
		} catch (e) {
			console.error('Failed to fetch logs:', e);
			if (!isLoadMore) {
				setLogs([]);
				setTotal(0);
			}
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	}, [date, level, user, debouncedSearch, page]);

	useEffect(() => {
		fetchLogs(page > 1);
	}, [fetchLogs, page]);

	// Auto-refresh logic
	useEffect(() => {
		if (!autoRefresh) return;

		const interval = setInterval(() => {
			if (page === 1 && !loading && !loadingMore) {
				fetchLogs();
			}
		}, 10000);

		return () => clearInterval(interval);
	}, [autoRefresh, page, fetchLogs]);

	// Date navigation
	const currentDateIndex = availableDates.indexOf(date);
	const hasPrev = currentDateIndex < availableDates.length - 1 && currentDateIndex !== -1;
	const hasNext = currentDateIndex > 0;

	const goToPrevDate = () => {
		if (hasPrev) setDate(availableDates[currentDateIndex + 1]);
	};

	const goToNextDate = () => {
		if (hasNext) setDate(availableDates[currentDateIndex - 1]);
	};

	// Clear all
	const handleClearAll = async () => {
		setClearing(true);
		try {
			await apiFetch('logs/clear', { method: 'POST' });
			setShowClearModal(false);
			setLogs([]);
			setPage(1);
			fetchLogs();
		} catch (e) {
			console.error('Failed to clear logs:', e);
		} finally {
			setClearing(false);
		}
	};

	// Save log settings
	const handleSaveLogSettings = async () => {
		setSavingSettings(true);
		try {
			// Trigger the global save settings logic from the store
			const { saveSettings } = useSettingsStore.getState();
			await saveSettings();
			setShowSettingsModal(false);
		} catch (e) {
			console.error('Failed to save log settings:', e);
		} finally {
			setSavingSettings(false);
		}
	};

	const handleLoadMore = () => {
		if (!loading && !loadingMore) {
			setPage((prev) => prev + 1);
		}
	};

	// Export Logs
	const handleExport = (range: 'day' | 'week' | 'month') => {
		const url = `${(window as any).productBaySettings?.apiUrl}logs/export?date=${date}&range=${range}&_wpnonce=${(window as any).productBaySettings?.nonce}`;
		window.location.href = url;
		setShowExportDropdown(false);
	};

	// Pagination math
	const hasMore = logs.length < total;

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<ScrollTextIcon className="w-5 h-5 text-gray-500" />
					<h3 className="text-lg font-semibold text-gray-800 m-0">
						{__('Activity Log', 'productbay')}
					</h3>
					{settings.logging_enabled === false && (
						<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wider">
							<AlertTriangleIcon className="w-3.5 h-3.5" />
							{__('Logging Disabled', 'productbay')}
						</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					{/* Export Dropdown */}
					<div className="relative">
						<Button
							variant="outline"
							onClick={() => setShowExportDropdown(!showExportDropdown)}
							disabled={logs.length === 0}
							className={`cursor-pointer text-gray-600 ${logs.length === 0 ? 'opacity-50' : ''}`}
						>
							<DownloadIcon className="w-4 h-4 mr-1.5" />
							{__('Export', 'productbay')}
							<ChevronDownIcon className="w-3.5 h-3.5 ml-1.5 opacity-50" />
						</Button>

						{showExportDropdown && (
							<div className="absolute right-0 top-full mt-1.5 px-2 py-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden py-1">
								<button
									onClick={() => handleExport('day')}
									className="w-full px-4 py-2 text-left text-sm text-gray-700 rounded-md bg-transparent hover:bg-gray-200 cursor-pointer flex items-center gap-2"
								>
									{__('Export Day', 'productbay')}
								</button>
								<button
									onClick={() => handleExport('week')}
									className="w-full px-4 py-2 text-left text-sm text-gray-700 rounded-md bg-transparent hover:bg-gray-200 cursor-pointer flex items-center gap-2"
								>
									{__('Export Week', 'productbay')}
								</button>
								<button
									onClick={() => handleExport('month')}
									className="w-full px-4 py-2 text-left text-sm text-gray-700 rounded-md bg-transparent hover:bg-gray-200 cursor-pointer flex items-center gap-2"
								>
									{__('Export Month', 'productbay')}
								</button>
							</div>
						)}
					</div>

					<Button
						variant="outline"
						size="icon"
						onClick={() => setShowSettingsModal(true)}
						className="cursor-pointer text-gray-500 hover:text-blue-600 hover:border-blue-200"
						title={__('Log Settings', 'productbay')}
					>
						<SettingsIcon className="w-4 h-4" />
					</Button>

					<div className="w-px h-6 bg-gray-200 mx-1" />

					<Button
						variant="outline"
						onClick={() => {
							setLogs([]);
							setPage(1);
							fetchLogs();
						}}
						className="cursor-pointer text-gray-600"
						title={__('Refresh', 'productbay')}
					>
						<RefreshCwIcon className={`w-4 h-4 ${loading && !loadingMore ? 'animate-spin' : ''}`} />
					</Button>
					<Button
						variant="destructive"
						onClick={() => setShowClearModal(true)}
						disabled={availableDates.length === 0}
						className={`${availableDates.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
					>
						<TrashIcon className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Filters Bar */}
			<div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
				{/* Date Navigator */}
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						onClick={goToPrevDate}
						disabled={!hasPrev}
						className={`p-1.5 ${!hasPrev ? 'cursor-not-allowed' : 'cursor-pointer'}`}
						title={__('Previous day', 'productbay')}
					>
						<ChevronLeftIcon className="w-4 h-4" />
					</Button>
					<div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md min-w-[180px] justify-center">
						<CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
						<span className="text-sm font-medium text-gray-700">
							{formatDateLabel(date)}
						</span>
					</div>
					<Button
						variant="outline"
						onClick={goToNextDate}
						disabled={!hasNext}
						className={`p-1.5 ${!hasNext ? 'cursor-not-allowed' : 'cursor-pointer'}`}
						title={__('Next day', 'productbay')}
					>
						<ChevronRightIcon className="w-4 h-4" />
					</Button>
				</div>

				{/* Level Filter */}
				<Select
					value={level}
					onChange={setLevel}
					options={[
						{ label: __('All Levels', 'productbay'), value: '' },
						...LEVEL_OPTIONS.filter(Boolean).map((l) => ({
							label: LEVEL_CONFIG[l as keyof typeof LEVEL_CONFIG]?.label || l,
							value: l,
						})),
					]}
					size="sm"
					className="w-[140px]"
				/>

				{/* User Filter */}
				<Select
					value={user}
					onChange={setUser}
					options={[
						{ label: __('All Users', 'productbay'), value: '' },
						...uniqueUsers.map((u) => ({
							label: u === 'system' || u === 'cron' || u === 'wp-cli' ? u.toUpperCase() : u,
							value: u,
						})),
					]}
					size="sm"
					className="w-[140px]"
				/>

				{/* Search */}
				<div className="relative flex-1 min-w-[200px]">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
					<Input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={__('Search logs...', 'productbay')}
						className="pl-9 h-9"
					/>
				</div>
			</div>

			{/* Log Entries */}
			<div className="space-y-1.5 min-h-[200px]">
				{loading && logs.length === 0 ? (
					/* Skeleton loader */
					<div className="space-y-2">
						{Array.from({ length: perPage }).map((_, i) => (
							<div
								key={i}
								className="h-12 bg-gray-100 rounded-md animate-pulse"
								style={{ opacity: 1 - i * 0.08 }}
							/>
						))}
					</div>
				) : logs.length === 0 ? (
					/* Empty state */
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
							<ScrollTextIcon className="w-8 h-8 text-gray-300" />
						</div>
						<p className="text-gray-500 font-medium m-0">
							{settings.logging_enabled === false
								? __('Logging is currently turned off', 'productbay')
								: __('No log entries found', 'productbay')}
						</p>
						<p className="text-gray-400 text-sm mt-1 m-0">
							{settings.logging_enabled === false
								? __('Enable it in settings to start recording activity.', 'productbay')
								: (debouncedSearch || level
									? __('Try adjusting your filters.', 'productbay')
									: __('Activity will appear here as you use the plugin.', 'productbay'))}
						</p>
					</div>
				) : (
					logs.map((entry, i) => <LogRow key={`${entry.time}-${i}`} entry={entry} />)
				)}
			</div>

			{/* Load More */}
			{hasMore && (
				<div className="flex justify-center pt-4">
					<Button
						variant="outline"
						onClick={handleLoadMore}
						disabled={loadingMore}
						className="min-w-[160px] h-11 cursor-pointer text-gray-600 hover:bg-gray-50 border-gray-300 shadow-sm font-medium"
					>
						{loadingMore ? (
							<>
								<RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
								{__('Loading...', 'productbay')}
							</>
						) : (
							<>
								<ChevronDownIcon className="w-4 h-4 mr-2" />
								{__('Load More Logs', 'productbay')}
							</>
						)}
					</Button>
				</div>
			)}

			{/* Footer note */}
			{availableDates.length > 0 && (
				<p className="text-xs text-gray-400 m-0 pt-1">
					{__('Logs are retained for 30 days and automatically pruned.', 'productbay')}
				</p>
			)}

			{/* Settings Modal */}
			<Modal
				isOpen={showSettingsModal}
				onClose={() => setShowSettingsModal(false)}
				title={__('Log System Settings', 'productbay')}
				maxWidth="md"
				closeOnBackdropClick={true}
			>
				<div className="space-y-8 py-2">
					{/* Logging On/Off */}
					<div className="flex items-center justify-between gap-4">
						<div>
							<h4 className="text-sm font-bold text-gray-900 m-0">
								{__('Enable Logging', 'productbay')}
							</h4>
							<p className="text-sm text-gray-500 m-0">
								{__('Toggle the entire activity logging system on or off.', 'productbay')}
							</p>
						</div>
						<Toggle
							checked={settings.logging_enabled !== false}
							onChange={(e) => updateSettings({ ...settings, logging_enabled: e.target.checked })}
						/>
					</div>

					<hr className="border-gray-100" />

					{/* Live Mode */}
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className={`p-2 flex items-center justify-center w-10 w-10 border border-gray-100 rounded-lg ${autoRefresh ? 'bg-emerald-50' : 'bg-gray-100'}`}>
								<ZapIcon className={`w-5 h-5 ${autoRefresh ? 'text-emerald-600 fill-current' : 'text-gray-500'}`} />
							</div>
							<div>
								<h4 className="text-sm font-bold text-gray-900 m-0">
									{__('Live Mode', 'productbay')}
								</h4>
								<p className="text-sm text-gray-500 m-0">
									{__('Automatically refresh logs every 10 seconds.', 'productbay')}
								</p>
							</div>
						</div>
						<Toggle
							checked={autoRefresh}
							onChange={(e) => setAutoRefresh(e.target.checked)}
						/>
					</div>

					<hr className="border-gray-100" />

					{/* Retention */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-50 rounded-lg flex items-center justify-center w-10 w-10 border border-gray-100">
								<HistoryIcon className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<h4 className="text-sm font-bold text-gray-900 m-0">
									{__('Log Retention', 'productbay')}
								</h4>
								<p className="text-sm text-gray-500 m-0">
									{__('How long to keep logs before auto-cleaning.', 'productbay')}
								</p>
							</div>
						</div>

						<div className="pl-12 flex items-center gap-3">
							<Input
								type="number"
								min="1"
								max="365"
								value={settings.log_retention || 30}
								onChange={(e) => updateSettings({ ...settings, log_retention: parseInt(e.target.value, 10) || 30 })}
								className="w-32"
							/>
							<span className="text-sm font-medium text-gray-600">
								{__('days', 'productbay')}
							</span>
						</div>
					</div>
				</div>

				<div className="flex justify-end pt-6 border-t border-gray-100 mt-8">
					<Button
						variant="default"
						className="cursor-pointer"
						onClick={handleSaveLogSettings}
						disabled={savingSettings}
					>
						{savingSettings ? __('Saving...', 'productbay') : __('Save & Close', 'productbay')}
					</Button>
				</div>
			</Modal>

			{/* Clear All Modal */}
			<Modal
				isOpen={showClearModal}
				onClose={() => setShowClearModal(false)}
				title={__('Clear All Logs?', 'productbay')}
				maxWidth="sm"
				closeOnBackdropClick={true}
				primaryButton={{
					text: clearing
						? __('Clearing...', 'productbay')
						: __('Yes, Clear All', 'productbay'),
					onClick: handleClearAll,
					variant: 'danger',
					icon: <TrashIcon className="w-4 h-4" />,
					disabled: clearing,
				}}
				secondaryButton={{
					text: __('Cancel', 'productbay'),
					onClick: () => setShowClearModal(false),
					variant: 'secondary',
					disabled: clearing,
				}}
			>
				<p className="text-gray-600 m-0">
					{__(
						'This will permanently delete all activity log files. This action cannot be undone.',
						'productbay'
					)}
				</p>
			</Modal>
		</div>
	);
});

LogViewer.displayName = 'LogViewer';

export default LogViewer;
